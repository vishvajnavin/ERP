"use client";
import React from 'react';
import { Customer } from '@/types/customers';
import { Briefcase, MapPin, Star } from 'lucide-react';
import Image from 'next/image';

interface CustomerCardProps {
    customer: Customer;
    onSelect: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onSelect }) => {
    return (
        <div 
            onClick={onSelect}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-red-500"
        >
            <div className="p-5">
                <div className="flex items-center">
                    <Image width={64} height={64} className="h-16 w-16 rounded-full object-cover" src={customer.avatar} alt={`${customer.name}'s avatar`} />
                    <div className="ml-4">
                        <p className="text-lg font-bold text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                            <Briefcase size={14} className="mr-1.5 text-gray-400" />
                            {customer.company}
                        </p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center text-gray-500">
                            <MapPin size={14} className="mr-1.5" />
                            {customer.address}
                        </span>
                        <span className={`px-2.5 py-1 font-semibold rounded-full text-xs flex items-center gap-1
                            ${customer.status === 'VIP' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                            ${customer.status === 'New' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                            {customer.status === 'VIP' && <Star size={12} />}
                            {customer.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerCard;
