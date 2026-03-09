

# App Polish Plan: Bugs, Paper Cuts, and Quick Wins

## Bugs Found

### 1. Overdue date comparison is off-by-one
**File:** `ItemRow.tsx:45`
```ts
const isOverdue = item.due_date && new Date(item.due_date) < new Date();
```
`new Date("2026-03-09")` creates midnight UTC, so if the user is in any timezone west of UTC, items due **today** show as overdue. Fix: compare date strings, not Date objects, or strip time from both.

### 2. Onboarding shows for existing users who signed up before the feature
**File:** `useOnboarding.ts:23`
```ts
const needsOnboarding = !isLoading && settings?.has_completed_onboarding !== true;
```
If `settings` is `null` (no row exists — every pre-existing user), `needsOnboarding` is `true`. Existing users with items in their inbox will see the onboarding wizard. Fix: also check if the user has any existing items — if they do, skip onboarding.

### 3. Onboarding seeds duplicate context tags on re-trigger
**File:** `OnboardingModal.tsx:70`
The `supabase.from("tags").insert(inserts)` call doesn't check for existing tags. If onboarding somehow runs twice, you get duplicate `@phone`, `@computer`, etc. Fix: use `upsert` or check for existing tags first.

### 4. `(item as any)` casts throughout codebase
Multiple files cast `item as any` to access `recurrence_rule`, `checklist`, `waiting_on`, and `energy`. This means TypeScript can't catch errors on these fields. The `types.ts` file correctly uses `Tables<"items">` which should include these columns — the generated types likely haven't been refreshed. Not a runtime bug, but a maintenance hazard.

### 5. Completed items in Someday `DoneSection` shows ALL completed items
**File:** `SomedayView.tsx:14`
```ts
const { data: completedItems } = useCompletedItems(selectedAreaId);
```
This fetches **all** completed items, not just those that were previously in "someday" state. Same issue in `NextView` and `FocusView`. The DoneSection shows completed items from every state.

---

## Paper Cuts

### 6. No loading spinner on most views
Inbox, Next, Focus, Someday, Reference, Scheduled all render `null` during loading — the screen is blank. Only WaitingView has a spinner. Add a consistent skeleton or spinner.

### 7. Checklist items can't be reordered
`ChecklistEditor` has a `GripVertical` import but no drag-and-drop. Users can't reorder sub-tasks.

### 8. No confirmation before delete
`ItemEditor` delete button immediately deletes with no confirmation dialog. Accidental taps lose data permanently.

### 9. QuickAddBar auto-opens editor after create
After adding an item, `setEditingItemId(item.id)` immediately opens the editor. For rapid capture (GTD principle), this adds friction. Should be optional or removed — let users tap to edit if they want.

### 10. No keyboard shortcut for quick-add on desktop
Desktop users have no shortcut to start adding items. A global `Cmd+K` or `N` shortcut would improve flow.

### 11. ItemRow time estimate display bug for non-round hours
`item.time_estimate >= 60 ? ${item.time_estimate / 60}h` — for 120 this shows "2h" (fine), but if someone hypothetically had 90 it'd show "1.5h". Not a current issue since options are fixed, but fragile.

### 12. No visual indicator for recurring items in ItemRow
Recurring items look identical to one-off items in the list. No repeat icon or badge.

### 13. No visual indicator for items with checklists in ItemRow
Same — no way to see at a glance that an item has sub-tasks.

### 14. Filter bar is always visible even when no items exist
The `ItemFilterBar` renders on Next, Focus, Someday, etc. even when the view is empty, adding visual noise.

### 15. No "undo" on complete
Swiping right to complete shows a toast but no undo action. The toast should include an "Undo" button.

---

## Implementation Plan

### Phase 1: Bug Fixes (Critical)
1. **Fix overdue date comparison** — Compare using date strings: `item.due_date < new Date().toISOString().split("T")[0]`
2. **Fix onboarding for existing users** — Check if user has any items before showing wizard
3. **Fix duplicate tag seeding** — Check existing tags before inserting contexts
4. **Fix DoneSection scope** — The completed items query doesn't know original state, so this is a design limitation. Best fix: don't show DoneSection on views where it's misleading (Someday, Focus)

### Phase 2: Paper Cuts (Quick Wins)
5. **Add loading skeletons** — Create a shared `ItemListSkeleton` component with 3-5 pulsing placeholder rows, use across all views
6. **Add delete confirmation** — Wrap the delete button in an `AlertDialog`
7. **Add recurring badge to ItemRow** — Show a small `Repeat` icon next to the title for items with `recurrence_rule`
8. **Add checklist progress to ItemRow** — Show "2/5" mini badge when item has checklist items
9. **Add undo to complete toast** — Change `toast.success("Completed!")` to include an undo action that restores the item
10. **Hide filter bar when list is empty** — Only render `ItemFilterBar` when items exist
11. **Stop auto-opening editor after quick-add** — Remove `setEditingItemId(item.id)` from `QuickAddBar`

### Phase 3: Polish
12. **Add keyboard shortcut for quick-add** — Listen for `n` key on desktop to focus the QuickAddBar input
13. **Remove GripVertical import from ChecklistEditor** — It's imported but unused

### Files to Edit

| File | Changes |
|---|---|
| `ItemRow.tsx` | Fix overdue, add recurrence icon, add checklist badge, undo toast |
| `useOnboarding.ts` | Skip onboarding for users with existing items |
| `OnboardingModal.tsx` | Deduplicate tag seeding |
| `SomedayView.tsx` | Remove misleading DoneSection |
| `FocusView.tsx` | Scope DoneSection to focused completed only (already done — verify) |
| `QuickAddBar.tsx` | Remove auto-open editor |
| `ItemEditor.tsx` | Add delete confirmation dialog |
| `ItemFilterBar.tsx` | Accept `itemCount` prop, hide when 0 |
| `NextView.tsx`, `InboxView.tsx`, etc. | Add loading skeleton, pass item count to filter bar |
| `ChecklistEditor.tsx` | Remove unused import |

No database changes needed. Entirely frontend fixes.

