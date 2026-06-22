REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_subscription_status() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.batch_reorder_items(uuid[], integer[], text) FROM PUBLIC, anon;