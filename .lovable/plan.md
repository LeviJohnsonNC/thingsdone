

## Add Collapsible "Done" Section to All Task Views

### Overview
Add a collapsible "Done" section below the active items in each view that shows completed items. Collapsed by default, click to expand. Completed items show a filled checkbox; unchecking restores them to their previous state.

### Approach

**1. Create `DoneSection` reusable component** (`src/components/DoneSection.tsx`)
- Accepts an array of completed `Item[]`
- Renders a collapsible header: `▸ Done` (collapsed) / `▾ Done` (expanded) with item count
- Uses local `useState` for open/closed, defaults to `false`
- Each item rendered with a filled/checked checkbox and the item title (styled with line-through or muted)
- Clicking the checkbox calls `useUpdateItem` to set `state` back to the item's previous state (we'll use `"next"` as the default restore state, or the view's native state)
- Minimal styling matching the screenshots: light row background, checked blue checkbox icon, no swipe gestures on done items

**2. Add `useUncompleteItem` hook** (`src/hooks/useItems.ts`)
- Mutation that sets `state` to a given value (e.g. `"inbox"`, `"next"`) and clears `completed_at`
- Or: the `DoneSection` component accepts a `restoreState` prop and uses `useUpdateItem` directly

**3. Update each view to split items and render `DoneSection`**

- **InboxView**: Fetch both `"inbox"` and `"completed"` items (or fetch all and filter). Add `<DoneSection>` below the item list. Restore state = `"inbox"`.
- **NextView**: Same pattern, completed items that were previously `"next"`. Restore state = `"next"`.
- **FocusView**: Show completed focused items. Restore state = keep `is_focused: true` and set state back to `"next"`.
- **SomedayView**: Completed someday items. Restore state = `"someday"`.
- **ProjectDetailView**: Already fetches all project items. Split into incomplete vs completed. Render `<DoneSection>` between item list and add form. Restore state = `"next"`.

**4. Data fetching adjustment**
- For views that currently filter by state (Inbox, Someday), we need completed items too. Two options:
  - **Option A**: Fetch completed items separately with a second query filtered by the view's context (e.g. completed items that were originally inbox). Problem: we don't track "original state."
  - **Option B (chosen)**: For Inbox/Next/Someday/Focus, use `useCompletedItems(areaId)` to show all recently completed items in every view's Done section. This matches GTD apps like Nirvana where Done is a global section per view.
  - For **ProjectDetailView**, items are already fetched — just filter `state === "completed"`.

Since we don't track which state an item was in before completion, the Done section will use `useCompletedItems` for global views and filter from existing data for project views. Unchecking will restore to the view's native state.

### Files to change
- **Create** `src/components/DoneSection.tsx` — reusable collapsible done section
- **Edit** `src/pages/InboxView.tsx` — add DoneSection with `restoreState="inbox"`
- **Edit** `src/pages/NextView.tsx` — add DoneSection with `restoreState="next"`
- **Edit** `src/pages/FocusView.tsx` — add DoneSection with `restoreState="next"` + restore `is_focused`
- **Edit** `src/pages/SomedayView.tsx` — add DoneSection with `restoreState="someday"`
- **Edit** `src/pages/ProjectDetailView.tsx` — split items into active/done, render DoneSection

