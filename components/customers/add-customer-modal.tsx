"use client";
import React, { useState } from 'react';
import { Customer } from '@/types/customers';
import { X } from 'lucide-react';

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (customer: Omit<Customer, 'id' | 'dateAdded' | 'avatar' | 'totalOrders' | 'totalSpend' | 'lastOrder' | 'status'>) => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, company, email, phone, location });
        // Reset form
        setName('');
        setCompany('');
        setEmail('');
        setPhone('');
        setLocation('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-2xl p-8 m-4 max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Customer</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                        <input type="text" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                        <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                        <input type="text" placeholder="Location (e.g. City, State)" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg md:col-span-2" required />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700">Save Customer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerModal;
