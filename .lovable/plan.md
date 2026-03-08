

## Critique of the Proposed Plan

**What's good:**
- The step-by-step GTD review flow is solid and covers all the right areas
- Persisting reviews for history is valuable
- Undo system with `previous_state` snapshots is well thought out
- Per-step AI prompts keep token costs down

**What I'd simplify or change:**

1. **Too many steps.** 9 steps is exhausting. The Calendar step (Step 8) adds complexity for a feature many users won't have connected. Merge "Clear Your Head" into Inbox processing (just put a text box at the top of the Inbox step). That gets us to 7 core steps, with Calendar as a conditional 8th.

2. **"Quick Review" mode is premature.** Build Full mode first. Quick mode can be added later — it's just a flag that skips the summary and reduces AI verbosity. No need to design two modes upfront.

3. **AI should NOT auto-take actions.** The spec says "AI takes action immediately on suggestion." This is dangerous UX — users will feel out of control. Instead: AI suggests, user accepts with one tap. Batch accept ("Accept all") for power users. Undo is still available but less critical.

4. **`review_actions` table is over-engineered for v1.** Tracking every action with undo snapshots, `ai_suggested` flags, and `previous_state` JSONB is a lot of schema for a first version. Simpler: track actions in local state during the review, persist only the final `reviews` row with `stats` JSONB on completion. Add `review_actions` later if users want detailed history.

5. **No FK references to auth.users.** The spec has `user_id uuid references auth.users(id)` — per project rules, we should not FK to `auth.users`.

6. **CHECK constraints on `mode`.** Per guidelines, use validation triggers instead of CHECK constraints.

7. **Monetization gating is separate work.** The existing subscription system already gates features. We can add a review count check to `useUsageLimits` later without designing it now.

---

## Revised Plan

### Scope

Build a guided Weekly Review page at `/review` with AI-assisted suggestions across 7 steps. Persist completed reviews for history. No Quick mode in v1. AI suggests actions; user accepts/dismisses.

### Steps (7 total)

| # | Step | Data source |
|---|------|-------------|
| 1 | Clear Your Head + Process Inbox | `state = "inbox"` + freeform text input |
| 2 | Review Next Actions | `state = "next"` |
| 3 | Review Waiting For | `state = "waiting"` |
| 4 | Review Scheduled | `state = "scheduled"` |
| 5 | Review Someday/Maybe | `state = "someday"` |
| 6 | Review Projects | `projects` with `state = "active"` |
| 7 | Summary & Reflection | Aggregated stats + AI summary |

Calendar step appears as 6b (between Projects and Summary) only if Google Calendar is connected.

### Database

**One new table: `reviews`**

```sql
CREATE TABLE public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  started_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz,
  current_step int DEFAULT 1 NOT NULL,
  summary_text text,
  reflection_text text,
  stats jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reviews"
  ON public.reviews FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
```

No `review_actions` table in v1 — actions are tracked in React state during the session and summarized into `stats` JSONB on completion. Update `user_settings.last_review_at` when a review completes.

### Edge Function: `review-ai`

Single edge function that accepts a `step` number and the relevant items/projects/context. Uses Lovable AI (`google/gemini-3-flash-preview`) via the gateway. Returns structured suggestions using tool calling (not free-text JSON).

Each step gets a tailored system prompt. The function returns:
```json
{
  "observations": ["string"],
  "suggestions": [
    {
      "item_id": "uuid",
      "action": "move|complete|trash|create|update",
      "target_state": "next",
      "reasoning": "string",
      "suggested_fields": { "energy": "low", "time_estimate": 15 }
    }
  ]
}
```

For step 7 (summary), returns `summary_text` and `reflection_text`.

### Frontend Files

```text
src/pages/ReviewView.tsx              — Main page with step wizard + progress
src/components/review/
  ReviewProgress.tsx                  — Step progress bar (collapses on mobile)
  ClearAndInboxStep.tsx               — Step 1: brain dump + inbox processing
  StateReviewStep.tsx                 — Steps 2-5: reusable for next/waiting/scheduled/someday
  ProjectReviewStep.tsx               — Step 6: project health
  CalendarReviewStep.tsx              — Step 6b: calendar cross-reference (conditional)
  ReviewSummaryStep.tsx               — Step 7: AI summary + stats
  SuggestionCard.tsx                  — Individual AI suggestion with Accept/Dismiss
src/hooks/
  useReview.ts                        — useReducer for review session state
  useReviewAI.ts                      — Edge function calls per step
```

### Modified Files

- `src/App.tsx` — add `/review` route
- `src/components/layout/DesktopSidebar.tsx` — add "Weekly Review" under Organize with days-since badge
- `src/components/layout/MobileMoreMenu.tsx` — add "Weekly Review" entry
- `src/hooks/useUserSettings.ts` — update `last_review_at` on review completion

### Navigation

Add "Weekly Review" to sidebar under ORGANIZE (below Projects) with a `ClipboardList` icon. Show days since last review as a subtle badge (e.g., "12d"). Links to `/review`; if an in-progress review exists (no `completed_at`), resumes it.

### Suggestion UX

- AI returns suggestions per step
- Each suggestion rendered as a `SuggestionCard` with the item title, reasoning, and Accept/Dismiss buttons
- "Accept All" button at top of suggestion list for batch operations
- Accepted actions mutate items via existing `useUpdateItem` / `useCompleteItem` / `useDeleteItem` / `useCreateItem`
- No undo system in v1 — user explicitly accepts, so undo is less critical

### Implementation Order

1. Database migration (reviews table)
2. Review page skeleton with step wizard + progress bar + navigation
3. Step components showing relevant items with manual actions (no AI)
4. Edge function `review-ai` with Lovable AI integration
5. Connect AI suggestions to step components via `SuggestionCard`
6. Summary step with AI-generated reflection
7. Sidebar badge showing days since last review
8. Resume in-progress review logic

