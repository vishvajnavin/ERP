"use client";
import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import OrderCard from '@/components/view-orders/order-card';
import OrderDetailPanel from '@/components/view-orders/order-detail-panel';
import { Order } from '@/components/view-orders/types';
import { initialOrdersData, productionStages } from '@/components/view-orders/data';

const ViewOrdersPage = () => {
    const [orders, setOrders] = useState(initialOrdersData);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('All');

    const filteredOrders = useMemo(() =>
        orders
            .filter(order => stageFilter === 'All' || order.stage === stageFilter)
            .filter(order =>
                order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.model.toLowerCase().includes(searchTerm.toLowerCase())
            ), [orders, searchTerm, stageFilter]);

    const handleUpdateOrder = (updatedOrder: Order) => {
        setOrders(prevOrders => prevOrders.map(o => o.orderId === updatedOrder.orderId ? updatedOrder : o));
        if (selectedOrder && selectedOrder.orderId === updatedOrder.orderId) {
            setSelectedOrder(updatedOrder);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 h-full">
            <div className="flex gap-6 h-full">
                <div className={`transition-all duration-500 ease-in-out ${selectedOrder ? 'w-full lg:w-2/3' : 'w-full'}`}>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Orders</h1>
                    <p className="text-gray-600 mb-6">Track all confirmed orders currently in the production pipeline.</p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Order ID, Customer, or Model..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={stageFilter}
                                onChange={(e) => setStageFilter(e.target.value)}
                                className="w-full sm:w-auto appearance-none bg-white pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            >
                                <option value="All">All Stages</option>
                                {productionStages.map(stage => <option key={stage.name} value={stage.name}>{stage.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {filteredOrders.map(order => <OrderCard key={order.orderId} order={order} onSelect={() => setSelectedOrder(order)} />)}
                    </div>
                    {filteredOrders.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm col-span-full">
                            <p className="text-gray-500 font-semibold">No orders match your criteria.</p>
                        </div>
                    )}
                </div>

                {selectedOrder && (
                    <div className="w-full lg:w-1/3 transition-all duration-500 ease-in-out">
                        <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={handleUpdateOrder} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewOrdersPage;
