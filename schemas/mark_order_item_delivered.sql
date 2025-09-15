CREATE OR REPLACE FUNCTION public.mark_order_item_delivered(p_order_item_id INT)
RETURNS VOID AS $$
BEGIN
  -- Delete all stage statuses for the order item
  DELETE FROM public.order_item_stage_status
  WHERE order_item_id = p_order_item_id;

  -- Update the delivery date for the order item
  UPDATE public.order_items
  SET delivery_date = CURRENT_DATE
  WHERE id = p_order_item_id;
END;
$$ LANGUAGE plpgsql;
