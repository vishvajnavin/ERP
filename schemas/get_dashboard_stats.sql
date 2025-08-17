CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSONB
AS $$
DECLARE
    total_orders BIGINT;
    orders_in_production BIGINT;
    completed_orders_month BIGINT;
    overdue_orders BIGINT;
    production_pipeline JSONB;
    production_chart JSONB;
    recent_orders JSONB;
BEGIN
    -- KPIs
    SELECT COUNT(*) INTO total_orders FROM public.order_items;
    SELECT COUNT(*) INTO orders_in_production FROM public.order_items WHERE delivery_date IS NULL;
    SELECT COUNT(*) INTO completed_orders_month FROM public.order_items WHERE delivery_date >= NOW() - INTERVAL '30 days';
    SELECT COUNT(*) INTO overdue_orders FROM public.order_items WHERE due_date < NOW() AND delivery_date IS NULL;

    -- Production Pipeline
    SELECT jsonb_object_agg(stage, count)
    INTO production_pipeline
    FROM (
        SELECT production_stage AS stage, COUNT(*) AS count
        FROM public.order_items
        WHERE delivery_date IS NULL
        GROUP BY production_stage
    ) AS pipeline_counts;

    -- Production Chart (Orders started in the last 30 days)
    SELECT jsonb_agg(chart_data)
    INTO production_chart
    FROM (
        SELECT DATE(o.order_date) AS date, COUNT(oi.id) AS count
        FROM public.order_items oi
        JOIN public.orders o ON oi.order_id = o.id
        WHERE o.order_date >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(o.order_date)
        ORDER BY DATE(o.order_date)
    ) AS chart_data;

    -- Recent Orders
    SELECT jsonb_agg(recent_data)
    INTO recent_orders
    FROM (
        SELECT
            oi.id,
            cd.customer_name,
            COALESCE(sp.model_name, bp.model_name) AS product_name,
            oi.production_stage,
            oi.due_date
        FROM public.order_items oi
        JOIN public.orders o ON oi.order_id = o.id
        JOIN public.customer_details cd ON o.customer_id = cd.id
        LEFT JOIN public.sofa_products sp ON oi.sofa_product_id = sp.id
        LEFT JOIN public.bed_products bp ON oi.bed_product_id = bp.id
        ORDER BY o.order_date DESC
        LIMIT 5
    ) AS recent_data;

    RETURN jsonb_build_object(
        'total_orders', total_orders,
        'orders_in_production', orders_in_production,
        'completed_orders_month', completed_orders_month,
        'overdue_orders', overdue_orders,
        'production_pipeline', production_pipeline,
        'production_chart', production_chart,
        'recent_orders', recent_orders
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO public;
