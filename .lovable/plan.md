

## Drag-to-Reorder Items

### Why this is moderately tricky
The items already have `sort_order` (global) and `sort_order_project` (within project) columns, so persistence infrastructure exists. The main challenge is integrating drag-and-drop with the existing Framer Motion swipe gestures on `ItemRow` — both use touch/pointer events. We need a dedicated drag handle so the two don't conflict.

### Approach

**Library**: Use `@dnd-kit/core` + `@dnd-kit/sortable` — the standard React DnD library for sortable lists. It supports a drag handle pattern out of the box, keeping swipe gestures intact on the rest of the row.

**1. Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`**

**2. Create `SortableItemList` wrapper component** (`src/components/SortableItemList.tsx`)
- Wraps a list of items in `DndContext` + `SortableContext`
- On drag end: reorder the array optimistically, then call a new `useReorderItems` mutation
- Accepts `items`, `onReorder` callback, and passes through `ItemRow` props (showProject, dimmed)

**3. Add drag handle to `ItemRow`**
- Add a `GripVertical` icon (from lucide) to the left of the completion circle
- The handle gets the `useSortable` listeners/attributes so only dragging by the handle initiates reorder
- The rest of the row keeps its existing swipe behavior untouched
- Handle is subtle (muted gray, visible on hover or touch)

**4. Add `useReorderItems` mutation** (`src/hooks/useItems.ts`)
- Accepts an ordered array of `{ id, sort_order }` pairs
- Batch-updates `sort_order` for each item in a single call (loop of updates, or a Supabase RPC for efficiency)
- Invalidates `['items']` queries on success
- For project views, update `sort_order_project` instead

**5. Update all views** that render item lists to use `SortableItemList` instead of bare `.map()`:
- `InboxView` — reorder by `sort_order`
- `NextView` — reorder by `sort_order`
- `FocusView` — reorder by `sort_order`
- `SomedayView` — reorder by `sort_order`
- `ProjectDetailView` — reorder by `sort_order_project`
- `ScheduledView` — skip (sorted by date, reordering doesn't apply)
- `LogbookView` — skip (sorted by completion date)

### Files to change
- **Install** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Create** `src/components/SortableItemList.tsx` — DndContext wrapper with sortable logic
- **Edit** `src/components/ItemRow.tsx` — add optional drag handle (GripVertical icon) with sortable hook
- **Edit** `src/hooks/useItems.ts` — add `useReorderItems` mutation
- **Edit** 5 view files (Inbox, Next, Focus, Someday, ProjectDetail) — swap `.map()` for `<SortableItemList>`

