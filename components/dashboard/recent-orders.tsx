import React from 'react';
import { format } from 'date-fns';

// --- Type Definitions ---

export interface RecentOrderData {
  id: number;
  customer_name: string;
  product_name: string;
  production_stage: string;
  due_date: string;
}

interface RecentOrdersProps {
  data: RecentOrderData[];
}

// Recent Orders Component
const RecentOrders: React.FC<RecentOrdersProps> = ({ data }) => {
  const statusColors: Record<string, string> = {
    carpentry: 'bg-yellow-100 text-yellow-800',
    webbing: 'bg-blue-100 text-blue-800',
    marking_cutting: 'bg-indigo-100 text-indigo-800',
    stitching: 'bg-purple-100 text-purple-800',
    cladding: 'bg-pink-100 text-pink-800',
    final_qc: 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md col-span-1 lg:col-span-3">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="py-3 pr-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 pl-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50">
                <td className="py-3 pr-4 font-semibold text-red-600">{order.id}</td>
                <td className="py-3 px-4 text-gray-800">{order.customer_name}</td>
                <td className="py-3 px-4 text-gray-600">{order.product_name}</td>
                <td className="py-3 px-4 text-gray-800 font-medium">{format(new Date(order.due_date), 'MMM dd, yyyy')}</td>
                <td className="py-3 pl-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[order.production_stage] ?? 'bg-gray-100 text-gray-800'}`}>
                    {order.production_stage}
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
