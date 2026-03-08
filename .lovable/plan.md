

## Re-apply: Remove Sequential/Parallel & Fix Next Action Display

The previous edits failed to persist. All files are still in their original state. Here's what needs to be done (same changes as before):

### Files to change

**1. `src/lib/types.ts`** — Remove the `ProjectType` export (line 11).

**2. `src/pages/ProjectsView.tsx`** — Two changes:
- Remove the `project.type` label (line 81-83 showing "Parallel"/"Sequential")
- Move the `→ nextAction` text up inline with the stats row (where the type label was), and sort items by `sort_order_project` to get the correct first action

**3. `src/pages/ProjectDetailView.tsx`** — Three changes:
- Remove the Sequential/Parallel toggle Badge (lines 79-88)
- Simplify `dimmedIds` to always dim items after the first (remove the `project.type !== "sequential"` check)
- Remove `Badge` import

**4. `src/hooks/useItems.ts`** — In `useNextItems`, treat all projects as sequential (only show first incomplete item per project, sorted by `sort_order_project`).

