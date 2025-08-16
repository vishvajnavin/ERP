"use server";

import { createClient } from "@/utils/supabase/server";
import { OrderHistory } from "@/components/order-history/types";

export async function getOrderHistory(): Promise<OrderHistory[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
      id,
      due_date,
      delivery_date,
      production_stage,
      product_type,
      sofa_products (model_name),
      bed_products (model_name),
      orders (
        order_date,
        customer_details (
          customer_name,
          address
        )
      )
    `
    )
    .order("due_date", { ascending: false });

  if (error) {
    console.error("Error fetching order history:", error);
    return [];
  }

  const orders: OrderHistory[] = data.map((item: any) => ({
    id: item.id,
    customerName: item.orders.customer_details.customer_name,
    orderDate: new Date(item.orders.order_date).toLocaleDateString(),
    dueDate: new Date(item.due_date).toLocaleDateString(),
    deliveryDate: item.delivery_date ? new Date(item.delivery_date).toLocaleDateString() : null,
    status: item.delivery_date ? "Delivered" : item.production_stage,
    total: 0, // Placeholder, as price is not in the schema
    productName:
      item.product_type === "sofa"
        ? item.sofa_products.model_name
        : item.bed_products.model_name,
    productType: item.product_type === "sofa" ? "Sofa" : "Bed",
  }));

  return orders;
}
