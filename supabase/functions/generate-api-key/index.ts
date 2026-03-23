import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Authenticate the user
    const authHeader = req.headers.get("Authorization")!;
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    if (req.method === "DELETE") {
      const body = await req.json();
      const keyId = body.key_id;

      if (!keyId) {
        return new Response(JSON.stringify({ error: "key_id is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabase
        .from("api_keys")
        .delete()
        .eq("id", keyId)
        .eq("user_id", user.id);

      if (error) {
        return new Response(JSON.stringify({ error: "Failed to delete key" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST — generate a new key
    // Generate a random API key
    const rawBytes = new Uint8Array(32);
    crypto.getRandomValues(rawBytes);
    const apiKey = "td_" + Array.from(rawBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    const prefix = apiKey.substring(0, 10) + "...";

    // Hash the key for storage
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const keyHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const label = body.label?.trim() || "API Key";

    const { data: record, error: insertError } = await supabase
      .from("api_keys")
      .insert({
        user_id: user.id,
        key_hash: keyHash,
        key_prefix: prefix,
        label,
      })
      .select("id, key_prefix, label, created_at")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create API key" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return the full key ONCE — it can never be retrieved again
    return new Response(JSON.stringify({
      success: true,
      api_key: apiKey,
      key: record,
    }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
