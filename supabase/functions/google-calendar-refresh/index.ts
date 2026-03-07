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
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const userId = claimsData.claims.sub;

    // Use service role to read/write tokens
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: tokenRow, error: fetchError } = await adminClient
      .from("google_calendar_tokens")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError || !tokenRow) {
      return new Response(JSON.stringify({ error: "No token found" }), { status: 404, headers: corsHeaders });
    }

    const expiresAt = new Date(tokenRow.expires_at);
    const fiveMinFromNow = new Date(Date.now() + 5 * 60 * 1000);

    // If not expiring soon, return current token
    if (expiresAt > fiveMinFromNow) {
      return new Response(
        JSON.stringify({ access_token: tokenRow.access_token, expires_at: tokenRow.expires_at }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Refresh the token
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

    const refreshData = await refreshRes.json();

    if (!refreshRes.ok || !refreshData.access_token) {
      console.error("Refresh failed:", refreshData);
      return new Response(JSON.stringify({ error: "Token refresh failed" }), { status: 500, headers: corsHeaders });
    }

    const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000).toISOString();

    await adminClient
      .from("google_calendar_tokens")
      .update({
        access_token: refreshData.access_token,
        expires_at: newExpiresAt,
      })
      .eq("user_id", userId);

    return new Response(
      JSON.stringify({ access_token: refreshData.access_token, expires_at: newExpiresAt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
