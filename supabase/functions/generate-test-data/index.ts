import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "levijohnson@gmail.com";

const REQUIRED_KEYS = ["areas", "tags", "projects", "items"] as const;

function stripMarkdownFences(input: string): string {
  return input
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function parseJsonCandidate(candidate: unknown): any | null {
  if (!candidate) return null;
  if (typeof candidate === "object") return candidate;
  if (typeof candidate !== "string") return null;

  const cleaned = stripMarkdownFences(candidate)
    .replace(/[\u0000-\u0019]+/g, "")
    .trim();

  const attempts = [
    cleaned,
    cleaned.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]"),
  ];

  for (const attempt of attempts) {
    try {
      return JSON.parse(attempt);
    } catch {
      // continue
    }
  }

  return null;
}

function extractJsonStringFromText(content: string): string | null {
  const trimmed = stripMarkdownFences(content);

  // Prefer fenced JSON blocks if present
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) return fencedMatch[1];

  // Fallback to widest object/array slice
  const firstObj = trimmed.indexOf("{");
  const lastObj = trimmed.lastIndexOf("}");
  if (firstObj >= 0 && lastObj > firstObj) {
    return trimmed.slice(firstObj, lastObj + 1);
  }

  const firstArr = trimmed.indexOf("[");
  const lastArr = trimmed.lastIndexOf("]");
  if (firstArr >= 0 && lastArr > firstArr) {
    return trimmed.slice(firstArr, lastArr + 1);
  }

  return null;
}

function getMessageContentAsString(message: any): string {
  const content = message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text || part?.content || ""))
      .join("\n");
  }
  return "";
}

function hasRequiredDatasetShape(data: any): boolean {
  return !!data && REQUIRED_KEYS.every((key) => Array.isArray(data[key]));
}

function extractStructuredDataFromAIResult(result: any): any | null {
  const message = result?.choices?.[0]?.message;

  const candidates: unknown[] = [
    message?.tool_calls?.[0]?.function?.arguments,
    message?.function_call?.arguments,
  ];

  for (const candidate of candidates) {
    const parsed = parseJsonCandidate(candidate);
    if (hasRequiredDatasetShape(parsed)) return parsed;
  }

  const content = getMessageContentAsString(message);
  const extractedJson = content ? extractJsonStringFromText(content) : null;
  const parsedContent = parseJsonCandidate(extractedJson ?? content);
  if (hasRequiredDatasetShape(parsedContent)) return parsedContent;

  return null;
}

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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify user identity
    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userEmail = claimsData.claims.email;
    const userId = claimsData.claims.sub;
    if (userEmail !== ADMIN_EMAIL) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Lovable AI to generate test data
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const today = new Date().toISOString().split("T")[0];

    const systemPrompt = `You are a test data generator for a GTD (Getting Things Done) task management app. Generate realistic, varied data that simulates an active user who manages their life with GTD methodology. Today's date is ${today}.

Rules:
- Areas represent life categories (e.g., Work, Health, Home, Finance, Side Projects)
- Tags are context labels prefixed with @ (e.g., @home, @office, @errands, @computer, @phone, @waiting)
- Projects have a type: "parallel" (all tasks available) or "sequential" (only first incomplete task shows in Next)
- Project states: "active", "someday", "scheduled"
- Item states: "inbox", "next", "scheduled", "someday", "waiting", "completed"
- Energy levels: "low", "medium", "high" or null
- Time estimates are in minutes: 5, 10, 15, 30, 45, 60, 90, 120 or null
- Due dates should vary: some past (overdue), some this week, some next week, some next month
- Scheduled dates should be future dates
- Some items should have is_focused=true (starred items)
- Completed items need a completed_at timestamp (ISO format, within last 2 weeks)
- Items with state "waiting" should have a waiting_on string (e.g., "John to reply", "Client approval")
- Use sort_order starting from 0, incrementing by 1
- For sequential projects, items need sort_order_project values to define order
- Make titles realistic and specific, not generic
- Some items should have notes with actual useful content
- Create item_tag associations to link items to relevant context tags

Generate data for a productivity-focused professional who works in tech, exercises regularly, maintains a home, and has side projects.`;

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content:
                "Generate a complete set of GTD test data. Include 5 areas, 7 tags, 8 projects (mix of parallel/sequential, active/someday/scheduled), and 40 items distributed across all states. Also include item-tag associations.",
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "insert_test_data",
                description:
                  "Insert generated GTD test data into the database.",
                parameters: {
                  type: "object",
                  properties: {
                    areas: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          temp_id: { type: "string", description: "Temporary ID like area_1, area_2 for cross-referencing" },
                          name: { type: "string" },
                          sort_order: { type: "integer" },
                        },
                        required: ["temp_id", "name", "sort_order"],
                        additionalProperties: false,
                      },
                    },
                    tags: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          temp_id: { type: "string", description: "Temporary ID like tag_1, tag_2 for cross-referencing" },
                          name: { type: "string" },
                          sort_order: { type: "integer" },
                        },
                        required: ["temp_id", "name", "sort_order"],
                        additionalProperties: false,
                      },
                    },
                    projects: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          temp_id: { type: "string", description: "Temporary ID like proj_1 for cross-referencing" },
                          title: { type: "string" },
                          notes: { type: "string" },
                          state: { type: "string", enum: ["active", "someday", "scheduled"] },
                          type: { type: "string", enum: ["parallel", "sequential"] },
                          area_temp_id: { type: "string", description: "References an area temp_id, or empty string for none" },
                          is_focused: { type: "boolean" },
                          scheduled_date: { type: "string", description: "ISO date or empty string" },
                          due_date: { type: "string", description: "ISO date or empty string" },
                          sort_order: { type: "integer" },
                        },
                        required: ["temp_id", "title", "notes", "state", "type", "area_temp_id", "is_focused", "scheduled_date", "due_date", "sort_order"],
                        additionalProperties: false,
                      },
                    },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          temp_id: { type: "string" },
                          title: { type: "string" },
                          notes: { type: "string" },
                          state: { type: "string", enum: ["inbox", "next", "scheduled", "someday", "waiting", "completed"] },
                          project_temp_id: { type: "string", description: "References a project temp_id, or empty string for none" },
                          area_temp_id: { type: "string", description: "References an area temp_id, or empty string for none" },
                          is_focused: { type: "boolean" },
                          energy: { type: "string", enum: ["low", "medium", "high", ""] },
                          time_estimate: { type: "integer", description: "Minutes, or 0 for null" },
                          due_date: { type: "string", description: "ISO date or empty string" },
                          scheduled_date: { type: "string", description: "ISO date or empty string" },
                          waiting_on: { type: "string", description: "Who/what we're waiting on, or empty string" },
                          completed_at: { type: "string", description: "ISO timestamp or empty string" },
                          sort_order: { type: "integer" },
                          sort_order_project: { type: "integer" },
                          tag_temp_ids: { type: "array", items: { type: "string" }, description: "Array of tag temp_ids to associate" },
                        },
                        required: ["temp_id", "title", "notes", "state", "project_temp_id", "area_temp_id", "is_focused", "energy", "time_estimate", "due_date", "scheduled_date", "waiting_on", "completed_at", "sort_order", "sort_order_project", "tag_temp_ids"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["areas", "tags", "projects", "items"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "insert_test_data" },
          },
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway returned ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    console.log(
      "AI response structure:",
      JSON.stringify({
        hasChoices: !!aiResult.choices,
        choiceCount: aiResult.choices?.length,
        finishReason: aiResult.choices?.[0]?.finish_reason,
        hasToolCalls: !!aiResult.choices?.[0]?.message?.tool_calls,
        toolCallCount: aiResult.choices?.[0]?.message?.tool_calls?.length,
        hasFunctionCall: !!aiResult.choices?.[0]?.message?.function_call,
        hasContent: !!aiResult.choices?.[0]?.message?.content,
      })
    );

    let testData = extractStructuredDataFromAIResult(aiResult);

    if (!testData) {
      console.warn("Primary extraction failed; retrying with strict raw JSON response");
      const retryResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content:
                "Return ONLY a valid JSON object (no markdown, no prose) with keys: areas, tags, projects, items. Include 5 areas, 7 tags, 8 projects, 40 items, and tag_temp_ids on each item.",
            },
          ],
          temperature: 0.2,
        }),
      });

      if (!retryResponse.ok) {
        const retryErr = await retryResponse.text();
        throw new Error(`AI retry failed (${retryResponse.status}): ${retryErr.substring(0, 200)}`);
      }

      const retryResult = await retryResponse.json();
      testData = extractStructuredDataFromAIResult(retryResult);
    }

    if (!testData) {
      const preview = getMessageContentAsString(aiResult?.choices?.[0]?.message).substring(0, 200);
      throw new Error("AI did not return structured data after retry. Content preview: " + preview);
    }
    // Sanitize: ensure required fields exist, filter out invalid records
    testData.areas = (testData.areas || []).filter((a: any) => a && (a.name || a.title));
    testData.tags = (testData.tags || []).filter((t: any) => t && (t.name || t.title));
    testData.projects = (testData.projects || []).filter((p: any) => p && (p.title || p.name));
    testData.items = (testData.items || []).filter((i: any) => i && (i.title || i.name));

    console.log("Sanitized data counts:", {
      areas: testData.areas.length,
      tags: testData.tags.length,
      projects: testData.projects.length,
      items: testData.items.length,
    });

    // Insert using service role client (bypasses RLS)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Maps from temp_id to real UUID
    const areaMap = new Map<string, string>();
    const tagMap = new Map<string, string>();
    const projectMap = new Map<string, string>();

    // 1. Insert areas
    if (testData.areas.length > 0) {
      const { data: insertedAreas, error: aErr } = await adminClient
        .from("areas")
        .insert(
          testData.areas.map((a: any, i: number) => ({
            name: a.name || a.title || `Area ${i + 1}`,
            sort_order: a.sort_order ?? i,
            user_id: userId,
          }))
        )
        .select("id");
      if (aErr) throw new Error(`Areas insert failed: ${aErr.message}`);
      testData.areas.forEach((a: any, i: number) => {
        areaMap.set(a.temp_id || a.id || `area_${i}`, insertedAreas![i].id);
      });
    }

    // 2. Insert tags
    if (testData.tags.length > 0) {
      const { data: insertedTags, error: tErr } = await adminClient
        .from("tags")
        .insert(
          testData.tags.map((t: any) => ({
            name: t.name,
            sort_order: t.sort_order,
            user_id: userId,
          }))
        )
        .select("id");
      if (tErr) throw new Error(`Tags insert failed: ${tErr.message}`);
      testData.tags.forEach((t: any, i: number) => {
        tagMap.set(t.temp_id, insertedTags![i].id);
      });
    }

    // 3. Insert projects
    if (testData.projects.length > 0) {
      const { data: insertedProjects, error: pErr } = await adminClient
        .from("projects")
        .insert(
          testData.projects.map((p: any) => ({
            title: p.title,
            notes: p.notes || "",
            state: p.state,
            type: p.type,
            area_id: p.area_temp_id ? areaMap.get(p.area_temp_id) || null : null,
            is_focused: p.is_focused,
            scheduled_date: p.scheduled_date || null,
            due_date: p.due_date || null,
            sort_order: p.sort_order,
            user_id: userId,
          }))
        )
        .select("id");
      if (pErr) throw new Error(`Projects insert failed: ${pErr.message}`);
      testData.projects.forEach((p: any, i: number) => {
        projectMap.set(p.temp_id, insertedProjects![i].id);
      });
    }

    // 4. Insert items
    const itemTagAssociations: { item_index: number; tag_temp_ids: string[] }[] = [];
    if (testData.items.length > 0) {
      const { data: insertedItems, error: iErr } = await adminClient
        .from("items")
        .insert(
          testData.items.map((item: any, idx: number) => {
            if (item.tag_temp_ids?.length > 0) {
              itemTagAssociations.push({ item_index: idx, tag_temp_ids: item.tag_temp_ids });
            }
            return {
              title: item.title,
              notes: item.notes || "",
              state: item.state,
              project_id: item.project_temp_id ? projectMap.get(item.project_temp_id) || null : null,
              area_id: item.area_temp_id ? areaMap.get(item.area_temp_id) || null : null,
              is_focused: item.is_focused,
              energy: item.energy || null,
              time_estimate: item.time_estimate || null,
              due_date: item.due_date || null,
              scheduled_date: item.scheduled_date || null,
              waiting_on: item.waiting_on || null,
              completed_at: item.completed_at || null,
              sort_order: item.sort_order,
              sort_order_project: item.sort_order_project,
              user_id: userId,
            };
          })
        )
        .select("id");
      if (iErr) throw new Error(`Items insert failed: ${iErr.message}`);

      // 5. Insert item_tags
      const itemTagRows: { item_id: string; tag_id: string }[] = [];
      for (const assoc of itemTagAssociations) {
        const itemId = insertedItems![assoc.item_index].id;
        for (const tagTempId of assoc.tag_temp_ids) {
          const tagId = tagMap.get(tagTempId);
          if (tagId) {
            itemTagRows.push({ item_id: itemId, tag_id: tagId });
          }
        }
      }
      if (itemTagRows.length > 0) {
        const { error: itErr } = await adminClient.from("item_tags").insert(itemTagRows);
        if (itErr) throw new Error(`Item_tags insert failed: ${itErr.message}`);
      }
    }

    const summary = {
      areas: testData.areas.length,
      tags: testData.tags.length,
      projects: testData.projects.length,
      items: testData.items.length,
      item_tags: itemTagAssociations.reduce((sum, a) => sum + a.tag_temp_ids.length, 0),
    };

    return new Response(JSON.stringify({ success: true, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-test-data error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
