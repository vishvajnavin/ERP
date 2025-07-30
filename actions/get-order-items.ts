// "use server";

import { createClient } from "@/utils/supabase/server";
import { Order, Priority, Stage } from "@/components/view-orders/types";

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
        id,
        model_name,
        upholstery,
        upholstery_color
      ),
      bed_products (
        id,
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
    console.log(item);
    const correctedItem = item as unknown as {
      id: number;
      due_date: string;
      production_stage: Stage;
      priority: Priority;
      orders: { customer_details: { customer_name: string } };
      sofa_products: { id: number; model_name: string; upholstery: string; upholstery_color: string; } | null;
      bed_products: { id: number; model_name: string; upholstery: string; upholstery_color: string; } | null;
    };

    // Access related records directly as objects.
    const product = correctedItem.sofa_products || correctedItem.bed_products;

    // Access the nested customer details object directly.
    const customerName =
      correctedItem.orders?.customer_details?.customer_name || "N/A";

    const productName = product?.model_name || "N/A";
    const upholstery = product
      ? `${product.upholstery} - ${product.upholstery_color}`
      : "N/A";

    const productType = correctedItem.sofa_products ? 'Sofa' : 'Bed';

    return {
      id: correctedItem.id.toString(),
      customer: customerName,
      product: productName,
      upholstery,
      dueDate: correctedItem.due_date,
      stage: correctedItem.production_stage,
      priority: Number(correctedItem.priority) as Priority,
      qc_checklist: {},
      productId: product!.id,
      productType: productType,
    };
  });
}
