import { getOrderItems } from "@/actions/get-order-items";
import ViewOrdersClient from "@/components/view-orders/view-orders-client";

export const revalidate = 0;

export default async function ViewOrdersPage() {
  const { orders, totalCount } = await getOrderItems();
  return (
    <div className="relative bg-white min-h-screen" suppressHydrationWarning>
      <ViewOrdersClient initialOrders={orders} totalCount={totalCount} />
    </div>
  );
}
