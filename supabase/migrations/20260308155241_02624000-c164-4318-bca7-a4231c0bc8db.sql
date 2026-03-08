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