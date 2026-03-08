

## Fix Drag-and-Drop Jitter -- Hardened Plan

### Root Cause
Your analysis is spot-on. The `onSettled` callback already only invalidates on error (from the previous fix attempt), but I see the code at lines 64-68 does match that pattern. Let me re-check -- yes, the current code already has the error-only guard. So the remaining jitter likely comes from:

1. **dnd-kit transition clash**: `SortableItemRow` applies CSS `transition` when `isDragging` flips to `false`, which animates the transform clearing out simultaneously with React re-rendering from the optimistic update
2. **No `animateLayoutChanges` override**: dnd-kit's default layout animation can fight with the optimistic reorder
3. **Individual UPDATE calls**: N separate Supabase calls means N network roundtrips -- if any fails partway, partial state is messy

### Changes

#### 1. `src/hooks/useReorderItems.ts` -- Batch via RPC
- Create a database function `batch_reorder_items(ids uuid[], orders int[], field text)` that updates all rows in a single transaction
- Replace `Promise.all` of individual updates with a single RPC call
- Keep the error-only invalidation in `onSettled` (already correct)

#### 2. Database migration -- `batch_reorder_items` RPC
```sql
CREATE OR REPLACE FUNCTION public.batch_reorder_items(
  p_ids uuid[],
  p_orders int[],
  p_field text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_field = 'sort_order' THEN
    UPDATE items SET sort_order = v.new_order
    FROM unnest(p_ids, p_orders) AS v(id, new_order)
    WHERE items.id = v.id AND items.user_id = auth.uid();
  ELSIF p_field = 'sort_order_project' THEN
    UPDATE items SET sort_order_project = v.new_order
    FROM unnest(p_ids, p_orders) AS v(id, new_order)
    WHERE items.id = v.id AND items.user_id = auth.uid();
  END IF;
END;
$$;
```

#### 3. `src/components/SortableItemRow.tsx` -- Suppress post-drop animation
- Override `animateLayoutChanges` on the `useSortable` hook to return `false` during/after drop, preventing dnd-kit's layout animation from clashing with the optimistic re-render
- Remove the `transition` style when not dragging (set to `undefined` instead of dnd-kit's default)

#### 4. `src/components/SortableItemList.tsx` -- Add `DragOverlay` and `layoutMeasuring` config
- Add `layoutMeasuring: { strategy: "always" }` to `DndContext` to prevent stale measurements
- Optionally add a `DragOverlay` for a cleaner drag visual (prevents the original item from animating)

### Files to modify
- **New migration**: `batch_reorder_items` RPC function
- `src/hooks/useReorderItems.ts` -- use RPC, confirm error-only invalidation
- `src/components/SortableItemRow.tsx` -- suppress layout animation post-drop
- `src/components/SortableItemList.tsx` -- layoutMeasuring config

