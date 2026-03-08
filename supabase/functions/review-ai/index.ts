import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a GTD (Getting Things Done) coach helping a user with their weekly review.
Your job is to analyze their tasks, projects, and patterns, then suggest specific actions to keep their system clean and trustworthy.

Rules:
- Be concise and actionable. No fluff.
- When suggesting a state change, explain why in one sentence.
- When flagging something as stale, mention how long it's been untouched.
- When suggesting new tasks, make them concrete and start with a verb.
- Never suggest deleting something the user might want to keep — prefer "move to someday" over "trash" when uncertain.
- For sequential projects, pay attention to task order and dependencies.
- Respect the user's energy and time estimate system (low/medium/high, 5/15/30/60/120/240 min).`;

const STEP_PROMPTS: Record<number, string> = {
  1: `The user is processing their inbox during a weekly review.
Here are the inbox items (JSON array). For each item, suggest:
1. Which state to move it to (next, waiting, scheduled, someday, or trash)
2. Which project to assign it to (use project IDs, or null for none)
3. Energy level (low, medium, high) and time estimate (5, 15, 30, 60, 120, 240 minutes)
4. Any missing details that should be filled in

Also provide 1-2 brief observations about their inbox.`,
  2: `The user is reviewing their Next Actions during a weekly review.
Flag items that seem stale (created/updated 7+ days ago with no changes), have no energy or time estimate, or have vague titles.
Suggest: keep, move to someday, move to waiting, complete, or trash.
Provide 1-2 observations.`,
  3: `The user is reviewing their Waiting For items during a weekly review.
Flag items based on how long they've been waiting, whether waiting_on is empty, and whether a follow-up seems overdue.
Suggest: follow_up (create a new next action), keep waiting, complete, or trash.
Provide 1-2 observations.`,
  4: `The user is reviewing their Scheduled items during a weekly review.
Group by: overdue (scheduled_date < today), this week, later.
For overdue items, suggest reschedule or move to next.
Provide 1-2 observations.`,
  5: `The user is reviewing their Someday/Maybe items during a weekly review.
Flag items that have been in someday for 30+ days with no updates.
Suggest: activate (move to next or scheduled), keep, or trash.
Provide 1-2 observations.`,
  6: `The user is reviewing their active projects during a weekly review.
For each project check:
- Does it have at least one item in "next" state? If not, flag it.
- Has the project stalled (no item changes in 14+ days)?
Suggest: add a next action (with AI-suggested title), mark project complete, or move to someday.
Provide 1-2 observations.`,
  7: `Generate a brief, encouraging summary of the user's weekly review. Include:
- Key stats (items processed, completed, created, moved, trashed)
- 2-3 specific observations about patterns (e.g., growing waiting list, stale projects, productivity trends)
- One actionable recommendation for the coming week

Return both a summary_text and reflection_text.`,
};

const TOOL_SCHEMA = {
  type: "function" as const,
  function: {
    name: "review_suggestions",
    description: "Return observations and actionable suggestions for the weekly review step.",
    parameters: {
      type: "object",
      properties: {
        observations: {
          type: "array",
          items: { type: "string" },
          description: "1-3 brief observations about the user's items for this step",
        },
        suggestions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              item_id: { type: "string", description: "ID of the item to act on (null for create actions)" },
              project_id: { type: "string", description: "ID of the project (if applicable)" },
              action: { type: "string", enum: ["move", "complete", "trash", "create", "update", "follow_up"] },
              target_state: { type: "string", enum: ["inbox", "next", "waiting", "scheduled", "someday", "trash"] },
              reasoning: { type: "string", description: "One-sentence explanation" },
              suggested_title: { type: "string", description: "Title for new items (create/follow_up actions)" },
              suggested_fields: {
                type: "object",
                properties: {
                  energy: { type: "string", enum: ["low", "medium", "high"] },
                  time_estimate: { type: "number", enum: [5, 15, 30, 60, 120, 240] },
                  waiting_on: { type: "string" },
                  project_id: { type: "string" },
                },
              },
            },
            required: ["action", "reasoning"],
          },
        },
        summary_text: { type: "string", description: "Summary of the review (step 7 only)" },
        reflection_text: { type: "string", description: "Reflections and recommendations (step 7 only)" },
      },
      required: ["observations", "suggestions"],
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(
      authHeader.replace("Bearer ", "")
    );
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { step, items, projects, context } = await req.json();
    const stepPrompt = STEP_PROMPTS[step];
    if (!stepPrompt) {
      return new Response(JSON.stringify({ error: "Invalid step" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build user message with context
    const userContent = `${stepPrompt}

Context:
${JSON.stringify(context, null, 2)}

${step <= 5 ? `Items:\n${JSON.stringify(items?.slice(0, 50), null, 2)}` : ""}
${step === 6 ? `Projects:\n${JSON.stringify(projects?.slice(0, 30), null, 2)}` : ""}
${step === 7 ? `Review stats:\n${JSON.stringify(context, null, 2)}` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [TOOL_SCHEMA],
        tool_choice: { type: "function", function: { name: "review_suggestions" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(
        JSON.stringify({ observations: [], suggestions: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("review-ai error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
