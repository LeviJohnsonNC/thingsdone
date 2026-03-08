

## Admin Section with AI Test Data Generation

### Overview
Add a hidden "Admin" section in Settings, visible only to your account (`levijohnson@gmail.com`), with a "Generate Test Data" button that calls an edge function. The edge function uses Lovable AI to generate realistic GTD data (areas, tags, projects, items across all states) and inserts it into the database.

### Architecture

```text
SettingsView.tsx
  └─ [if user.email === "levijohnson@gmail.com"]
      └─ Admin Section
          └─ "Generate Test Data" button
              └─ calls supabase.functions.invoke("generate-test-data")

Edge Function: generate-test-data/index.ts
  1. Verify caller is levijohnson@gmail.com (server-side check)
  2. Call Lovable AI (gemini-3-flash-preview) with a prompt describing
     the GTD schema and asking for realistic sample data
  3. Parse structured output via tool_choice
  4. Insert in order: areas → tags → projects → items → item_tags
  5. Return summary of what was created
```

### Changes

#### 1. New edge function: `supabase/functions/generate-test-data/index.ts`
- CORS headers, verify JWT = false, manually check auth
- Server-side email check: extract user from `Authorization` header, reject if not `levijohnson@gmail.com`
- Call Lovable AI with `tool_choice` to get structured JSON containing:
  - 4-5 areas (e.g., Work, Health, Home, Finance, Side Projects)
  - 6-8 tags (e.g., @home, @office, @errands, @computer, @phone, @waiting)
  - 6-8 projects across states (active, someday, scheduled), mix of parallel/sequential types
  - 30-40 items distributed across states (inbox, next, scheduled, someday, waiting, completed), with realistic titles, notes, due dates, time estimates, energy levels, focus flags
  - Item-tag associations
- Insert data in FK order using Supabase service role client
- Return counts of created records

#### 2. Update `supabase/config.toml`
- Add `[functions.generate-test-data]` with `verify_jwt = false`

#### 3. Update `src/pages/SettingsView.tsx`
- After the Danger Zone section (or before it), add an "Admin" section gated by `user?.email === "levijohnson@gmail.com"`
- Contains a "Generate Test Data" button with loading state
- On click: `supabase.functions.invoke("generate-test-data")`, then invalidate all queries and show a toast with the summary
- Style with a distinct admin-looking border (e.g., dashed purple border)

### Security
- The email check happens server-side in the edge function, not just client-side
- Uses service role key in the edge function to bypass RLS for bulk inserts
- Client-side gate is cosmetic only -- the real guard is the edge function

### AI Prompt Strategy
Use structured output (tool calling) so the AI returns a typed JSON blob. The prompt will describe the GTD methodology, the table schemas, and ask for data that looks like a real productivity-focused user -- varied due dates (some overdue), a mix of focused/unfocused items, some completed items with `completed_at` timestamps, sequential projects with ordered tasks, etc.

