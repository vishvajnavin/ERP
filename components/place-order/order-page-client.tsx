'use client';
import React, { useState, useActionState } from 'react';
import { Plus, CheckCircle, } from 'lucide-react';
import Image from 'next/image';
import { Customer } from '@/types/customers';
import { Product } from '@/types/products';
import { ProductEntryForm } from './product-entry-form';
import { useFormStatus } from 'react-dom';
import { submitOrder } from '@/actions/submit-order';
import getProductDetails from '@/actions/get-product-details';

// --- Types ---
export type OrderItem = {
    id: string | null;
    uniqueId: number;
    type: 'Sofa' | 'Bed';
    details: Product;
    isCustom: boolean;
    quantity: number;
};

const initialProductState: OrderItem = {
    id: null,
    uniqueId: Date.now(),
    type: 'Sofa',
    details: {} as Product, // Initialized as an empty Product object
    isCustom: false,
    quantity: 1,
};

// --- Main Page Component ---
const PlaceOrderPage = ({
    initialCustomers,
    initialSofaModels,
    initialBedModels,
}: {
    initialCustomers: Customer[];
    initialSofaModels: ({ id: string; model_name: string })[];
    initialBedModels: ({ id: string; model_name: string })[];
}) => {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>(initialCustomers[0]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([
        { ...initialProductState, uniqueId: Date.now() }
    ]);

    // React 19: useActionState hook to handle server action state
    const [state, formAction] = useActionState(submitOrder, { success: false, message: '' });

    const hasNameError = orderItems.some(item => {
        const nameExists = item.isCustom && (item.type == 'Sofa' ? initialSofaModels.some(p => p.model_name.toLowerCase() === item.details.model_name?.toLowerCase() && p.id !== item.id) :
        initialBedModels.some(p => p.model_name.toLowerCase() === item.details.model_name?.toLowerCase() && p.id !== item.id));
        return nameExists;
    });

    const handleItemChange = <K extends keyof OrderItem>(index: number, field: K, value: OrderItem[K]) => {
        const newItems = [...orderItems];
        newItems[index][field] = value;

        // If the type is changed, reset the product details
        if (field === 'type') {
            newItems[index].id = null;
            newItems[index].details = {} as Product;
            newItems[index].isCustom = false;
        }

        setOrderItems(newItems);
    };

    const handleDetailsChange = <K extends keyof Product>(index: number, detailField: K, value: Product[K]) => {
        const newItems = [...orderItems];
        if (!newItems[index].details) newItems[index].details = {} as Product;
        newItems[index].details[detailField] = value;
        setOrderItems(newItems);
    };

    const handleProductSelect = async (index: number, product: { id: string; type: 'Sofa' | 'Bed'; model_name: string; }) => {
        const newItems = [...orderItems];
        const productDetails=await getProductDetails(parseInt(product.id),product.type)
        newItems[index] = { ...newItems[index], id: product.id, type: product.type, details: productDetails.data?productDetails.data:{}, isCustom: false };
        setOrderItems(newItems);
    };


    const addNewItem = () => setOrderItems([...orderItems, { ...initialProductState, uniqueId: Date.now() }]);
    const removeItem = (index: number) => setOrderItems(orderItems.filter((_, i) => i !== index));


    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-full">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Place New Order</h1>
                {/* MODIFICATION: Changed div to form and passed the server action */}
                <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* MODIFICATION: Added hidden inputs for server action */}
                    <input type="hidden" name="selectedCustomerId" value={selectedCustomer.id} />
                    <input type="hidden" name="totalProducts" value={orderItems.length} />

                    <div className="lg:col-span-2 space-y-6">
                        {orderItems.map((item, index) => (
                            <ProductEntryForm
                                key={`${item.uniqueId}-${item.id || ''}`}
                                item={item}
                                index={index}
                                onItemChange={handleItemChange}
                                onDetailsChange={handleDetailsChange}
                                onProductSelect={handleProductSelect}
                                onRemove={removeItem}
                                isOnlyItem={orderItems.length === 1}
                            />
                        ))}
                        <button type="button" onClick={addNewItem} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 text-gray-500 font-semibold rounded-lg hover:bg-gray-200 hover:border-gray-400 transition">
                            <Plus size={20} /> Add Another Product
                        </button>
                    </div>

                    <div className="lg:col-span-1 space-y-6 sticky top-6">
                        <CustomerSelector customer={selectedCustomer} onSelect={setSelectedCustomer} />
                        <OrderSummary itemCount={orderItems.reduce((sum, item) => sum + item.quantity, 0)} disabled={hasNameError} />
                        {/* MODIFICATION: Display server response message */}
                        {state?.message && (
                             <div className={`flex items-start gap-3 p-4 rounded-lg ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{state.message}</p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};


const CustomerSelector = ({ customer, onSelect }: { customer: Customer, onSelect: (customer: Customer) => void }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-bold text-xl mb-4 text-gray-800">Customer</h3>
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Image src={customer.avatar || `https://placehold.co/100x100/E9D5FF/4C1D95?text=A`} alt="Customer Avatar" width={48} height={48} className="w-12 h-12 rounded-full mr-4" />
            <div>
                <p className="font-semibold text-gray-800">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.company}</p>
            </div>
            <button onClick={() => onSelect(customer)} className="ml-auto text-red-600 font-semibold text-sm">Change</button>
        </div>
    </div>
);

const SubmitButton = ({ disabled }: { disabled: boolean }) => {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending || disabled} className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed">
            {pending ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Placing Order...
                </>
            ) : (
                <>
                    <CheckCircle size={20} />
                    Confirm & Place Order
                </>
            )}
        </button>
    );
}

const OrderSummary = ({  itemCount, disabled }: {  itemCount: number, disabled: boolean }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-bold text-xl mb-4 text-gray-800">Order Summary</h3>
        <div className="space-y-2 text-gray-600">
            <div className="flex justify-between"><p>Total Items</p><p className="font-medium">{itemCount}</p></div>
        </div>
        <SubmitButton disabled={disabled} />
    </div>
);


export default PlaceOrderPage;
