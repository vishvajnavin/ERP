"use server";

import { createClient } from "@/utils/supabase/server";
import { Order, Priority, Stage } from "@/components/view-orders/types";

export async function getOrderItems(
  page: number = 1,
  limit: number = 10
): Promise<{ orders: Order[]; totalCount: number }> {
  const supabase = createClient();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit - 1;

  const { data, error, count } = await supabase
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
        id,
        model_name
      ),
      bed_products (
        id,
        model_name
      )
    `,
      { count: "exact" }
    )
    .range(startIndex, endIndex);

  if (error) {
    console.error("Error fetching order items:", error);
    return { orders: [], totalCount: 0 };
  }

  // Map the raw data to the 'Order' type expected by your components
  const orders = data.map((item) => {
    // Define a more specific type for the item with the new QC data
    const correctedItem = item as unknown as {
      id: number;
      due_date: string;
      production_stage: Stage; // This should correspond to a stage_id
      priority: Priority;
      orders: { customer_details: { customer_name: string } };
      sofa_products: { id: number; model_name: string } | null;
      bed_products: { id: number; model_name: string } | null;
    };

    const product = correctedItem.sofa_products || correctedItem.bed_products;
    const customerName =
      correctedItem.orders?.customer_details?.customer_name || "N/A";
    const productName = product?.model_name || "N/A";
    const productType = (correctedItem.sofa_products ? "Sofa" : "Bed") as
      | "Sofa"
      | "Bed";

    return {
      id: correctedItem.id.toString(),
      customer: customerName,
      product: productName,
      dueDate: correctedItem.due_date,
      stage: correctedItem.production_stage,
      priority: Number(correctedItem.priority) as Priority,
      productId: product!.id,
      productType: productType,
    };
  });
  return { orders, totalCount: count ?? 0 };
}
