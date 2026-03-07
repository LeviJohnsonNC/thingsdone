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

    // Get user from JWT
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

    // Get tokens
    const { data: tokenRow, error: tokenError } = await supabase
      .from("google_calendar_tokens")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (tokenError || !tokenRow) {
      return new Response(JSON.stringify({ events: [], connected: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Refresh token if needed
    let accessToken = tokenRow.access_token;
    const expiresAt = new Date(tokenRow.expires_at);
    if (expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
      const clientId = Deno.env.get("GOOGLE_CLIENT_ID")!;
      const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

      const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: tokenRow.refresh_token,
          grant_type: "refresh_token",
        }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        accessToken = refreshData.access_token;
        const newExpiry = new Date(Date.now() + refreshData.expires_in * 1000).toISOString();
        await supabase
          .from("google_calendar_tokens")
          .update({ access_token: accessToken, expires_at: newExpiry })
          .eq("user_id", user.id);
      } else {
        return new Response(JSON.stringify({ events: [], connected: true, error: "token_refresh_failed" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fetch events from now to +4 weeks
    const now = new Date();
    const fourWeeks = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);
    const calendarId = tokenRow.calendar_id || "primary";

    const params = new URLSearchParams({
      timeMin: now.toISOString(),
      timeMax: fourWeeks.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "250",
    });

    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!calRes.ok) {
      console.error("Calendar API error:", await calRes.text());
      return new Response(JSON.stringify({ events: [], connected: true, error: "calendar_api_error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const calData = await calRes.json();
    const events = (calData.items || []).map((e: any) => ({
      id: e.id,
      title: e.summary || "(No title)",
      start: e.start?.dateTime || e.start?.date || "",
      end: e.end?.dateTime || e.end?.date || "",
      isAllDay: !!e.start?.date,
      calendarSource: "google" as const,
    }));

    return new Response(JSON.stringify({ events, connected: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("sync-calendar-events error:", err);
    return new Response(JSON.stringify({ events: [], error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
