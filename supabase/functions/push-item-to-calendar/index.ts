import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: userError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, item_id, title, date, notes, google_event_id } = body;

    // Get tokens
    const { data: tokenRow } = await supabase
      .from("google_calendar_tokens")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!tokenRow) {
      return new Response(JSON.stringify({ error: "Google Calendar not connected" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Refresh token if needed
    let accessToken = tokenRow.access_token;
    const expiresAt = new Date(tokenRow.expires_at);
    if (expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
      const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: Deno.env.get("GOOGLE_CLIENT_ID")!,
          client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
          refresh_token: tokenRow.refresh_token,
          grant_type: "refresh_token",
        }),
      });
      if (refreshRes.ok) {
        const d = await refreshRes.json();
        accessToken = d.access_token;
        await supabase
          .from("google_calendar_tokens")
          .update({ access_token: accessToken, expires_at: new Date(Date.now() + d.expires_in * 1000).toISOString() })
          .eq("user_id", user.id);
      }
    }

    const calendarId = tokenRow.calendar_id || "primary";
    const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    // DELETE action
    if (action === "delete") {
      if (!google_event_id) {
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const delRes = await fetch(`${baseUrl}/${google_event_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // 404 = already deleted, that's fine
      if (!delRes.ok && delRes.status !== 404 && delRes.status !== 410) {
        console.error("Delete event error:", await delRes.text());
      }
      // Clear google_event_id on the item
      if (item_id) {
        await supabase.from("items").update({ google_event_id: null }).eq("id", item_id);
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // CREATE or UPDATE (upsert)
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const eventBody = {
      summary: title,
      description: notes || undefined,
      start: { date },
      end: { date: nextDay.toISOString().split("T")[0] },
    };

    let res: Response;
    if (google_event_id) {
      // Update existing
      res = await fetch(`${baseUrl}/${google_event_id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(eventBody),
      });
    } else {
      // Create new
      res = await fetch(baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(eventBody),
      });
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error("Calendar push error:", errText);
      return new Response(JSON.stringify({ error: "calendar_push_failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const eventData = await res.json();

    // Store google_event_id back on item
    if (item_id && eventData.id) {
      await supabase.from("items").update({ google_event_id: eventData.id }).eq("id", item_id);
    }

    return new Response(JSON.stringify({ success: true, google_event_id: eventData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("push-item-to-calendar error:", err);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
