// "use server";

import { createClient } from "@/utils/supabase/server";
import { Order, Priority } from "@/components/view-orders/types";

export async function getOrderItems(): Promise<Order[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
      id,
      due_date,
      production_stage,
      priority,
      orders (
        customer_details (
          customer_name
        )
      ),
      sofa_products (
        model_name,
        upholstery,
        upholstery_color
      ),
      bed_products (
        model_name,
        upholstery,
        upholstery_color
      )
    `
    );

  if (error) {
    console.error("Error fetching order items:", error);
    return [];
  }

  return data.map((item) => {
    // FIX 1: Access related records directly as objects, not arrays.
    const product = item.sofa_products || item.bed_products;
    
    // FIX 2: Access the nested customer details object directly.
    const customerName =
      item.orders?.[0]?.customer_details?.[0]?.customer_name || "N/A";

    const productName = product?.[0]?.model_name || "N/A";
    const upholstery = product && product[0]
      ? `${product[0].upholstery} - ${product[0].upholstery_color}`
      : "N/A";

    return {
      id: item.id.toString(),
      customer: customerName,
      product: productName,
      upholstery,
      dueDate: item.due_date,
      stage: item.production_stage,
      priority: Number(item.priority) as Priority,
      qc_checklist: {},
    };
  });
}
