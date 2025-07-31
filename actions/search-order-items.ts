"use server";

import { createClient } from "@/utils/supabase/server";
import { Order, Priority, Stage } from "@/components/view-orders/types";

// The RPC response will have a 'total_count' property
interface OrderDetailFromRPC {
  id: number;
  due_date: string;
  production_stage: string;
  priority: number;
  customer_name: string;
  product_model_name: string;
  total_count: number;
}

export async function searchOrderItems(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<{ orders: Order[]; totalCount: number }> {
  const supabase = createClient();
  const offset = (page - 1) * limit;

  // Call the new, powerful database function with all necessary parameters
  const { data, error } = await supabase.rpc('search_and_paginate_orders', {
    p_search_term: query,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) {
    console.error("Error fetching order items:", error);
    return { orders: [], totalCount: 0 };
  }

  // If no data is returned, we have an empty result
  if (!data || data.length === 0) {
    return { orders: [], totalCount: 0 };
  }

  const typedData = data as OrderDetailFromRPC[];

  // The total count is returned with every row, so we can just grab it from the first.
  const totalCount = typedData[0]?.total_count || 0;

  // Map the paginated data from the database to the required 'Order' type
  const orders = typedData.map((item) => {
    return {
      id: item.id.toString(),
      customer: item.customer_name || "N/A",
      product: item.product_model_name || "N/A",
      dueDate: item.due_date,
      stage: item.production_stage as Stage,
      priority: Number(item.priority) as Priority,
      qc_checklist: {},
      productId: 0,
      productType: "Sofa" as const,
    };
  });

  return { orders, totalCount };
}