

## Understanding Your Intent

Yes — the "Next" view should be your **single actionable dashboard**: everything you could act on *right now*. That means:

1. **First item from each project** — since all projects are sequential, only the top task is actionable
2. **All inbox items** — unprocessed stuff that needs attention
3. **Scheduled items due today** — they've "activated" and need action

Currently, Next only shows items with `state = "next"`. It doesn't include inbox or today's scheduled items.

## Changes

### 1. `src/hooks/useItems.ts` — Update `useNextItems`

Expand the query to fetch three categories in one hook:
- Items with `state = "next"` (existing, with sequential project filtering)
- Items with `state = "inbox"`
- Items with `state = "scheduled"` where `scheduled_date <= today`

Merge all three result sets, deduplicating by id. Apply area filter to all queries.

### 2. `src/pages/NextView.tsx` — Minor label updates

Update the empty state description to reflect the broader scope. No structural changes needed since the view already renders whatever `useNextItems` returns.

### 3. No database changes needed

All filtering uses existing columns (`state`, `scheduled_date`, `area_id`).

