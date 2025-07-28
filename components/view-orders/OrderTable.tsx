"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Order } from './types';
import { PRIORITY_CONFIG, STAGE_CONFIG } from './data';

interface OrderTableProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onOrderSelect }) => (
  <motion.div className="overflow-x-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-200/50">
          {['Priority', 'Order ID', 'Product', 'Customer', 'Due Date', 'Stage'].map(h => (
            <th key={h} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {orders.map(order => {
          const isOverdue = new Date(order.dueDate) < new Date();
          return (
            <tr
              key={order.id}
              onClick={() => onOrderSelect(order)}
              className="hover:bg-gray-50/50 cursor-pointer transition-colors duration-200"
            >
              <td className="px-6 py-5 whitespace-nowrap">
                <span
                  className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full text-white"
                  style={{ backgroundColor: PRIORITY_CONFIG[order.priority].color }}
                >
                  {PRIORITY_CONFIG[order.priority].label}
                </span>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-black">{order.id}</td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-800">{order.product}</td>
              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
              <td className={`px-6 py-5 whitespace-nowrap text-sm ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-600'}`}>
                {new Date(order.dueDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <span
                  className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full text-white"
                  style={{ backgroundColor: STAGE_CONFIG[order.stage].color }}
                >
                  {STAGE_CONFIG[order.stage].label}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </motion.div>
);

export default OrderTable;
