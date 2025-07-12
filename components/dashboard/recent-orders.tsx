import React from 'react';

// --- Type Definitions ---

interface RecentOrderData {
  orderId: string;
  customer: string;
  model: string;
  status: 'In Production' | 'Shipped' | 'Delivered';
  amount: string;
}

// Recent Orders Data
const recentOrdersData: RecentOrderData[] = [
  { orderId: '#SOFA-8462', customer: 'John Doe', model: 'Chesterfield Classic', status: 'In Production', amount: '$3,200' },
  { orderId: '#SOFA-8461', customer: 'Jane Smith', model: 'Modern L-Shape', status: 'Delivered', amount: '$4,500' },
  { orderId: '#SOFA-8460', customer: 'Emily White', model: 'Velvet Loveseat', status: 'In Production', amount: '$1,850' },
  { orderId: '#SOFA-8459', customer: 'Michael Brown', model: '3-Seater Recliner', status: 'Shipped', amount: '$3,800' },
  { orderId: '#SOFA-8458', customer: 'Sarah Green', model: 'Minimalist Futon', status: 'Delivered', amount: '$1,200' },
];

// Recent Orders Component
const RecentOrders: React.FC = () => {
  const statusColors: Record<RecentOrderData['status'], string> = {
    'In Production': 'bg-yellow-100 text-yellow-800',
    'Shipped': 'bg-blue-100 text-blue-800',
    'Delivered': 'bg-green-100 text-green-800',
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-md col-span-1 lg:col-span-2">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="py-3 pr-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Model</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 pl-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrdersData.map((order) => (
              <tr key={order.orderId} className="border-b border-gray-100 last:border-none hover:bg-gray-50">
                <td className="py-3 pr-4 font-semibold text-red-600">{order.orderId}</td>
                <td className="py-3 px-4 text-gray-800">{order.customer}</td>
                <td className="py-3 px-4 text-gray-600">{order.model}</td>
                <td className="py-3 px-4 text-gray-800 font-medium">{order.amount}</td>
                <td className="py-3 pl-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
