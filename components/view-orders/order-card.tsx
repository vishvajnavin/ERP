"use client";
import React from 'react';
import { Order } from './types';
import { productionStages } from './data';

interface OrderCardProps {
    order: Order;
    onSelect: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onSelect }) => {
    const currentStageIndex = productionStages.findIndex(s => s.name === order.stage);
    return (
        <div onClick={onSelect} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-red-600">{order.orderId}</p>
                        <p className="text-lg font-semibold text-gray-800">{order.model}</p>
                        <p className="text-sm text-gray-500">for {order.customer}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-semibold text-gray-800">{order.dueDate}</p>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-semibold text-gray-600">Production Stage:</p>
                        <p className="text-sm font-bold text-gray-900 px-2 py-1 rounded-md bg-red-50">{order.stage}</p>
                    </div>
                    <div className="flex items-center">
                        {productionStages.map((stage, index) => {
                            const isCompleted = index <= currentStageIndex;
                            return (
                                <React.Fragment key={stage.name}>
                                    <div className="relative flex flex-col items-center" title={stage.name}>
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            <stage.Icon className="h-4 w-4" />
                                        </div>
                                    </div>
                                    {index < productionStages.length - 1 && (
                                        <div className={`flex-1 h-1 transition-colors duration-300 ${isCompleted ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
