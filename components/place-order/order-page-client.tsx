'use client';
import React, { useState, useActionState, useEffect, useRef } from 'react';
import { Plus, CheckCircle, Search, X } from 'lucide-react';
import Image from 'next/image';
import { Customer } from '@/types/customers';
import { searchCustomers } from '@/actions/search-customers';
import { Input } from '@/components/ui/input';
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
    initialSofaModels,
    initialBedModels,
}: {
    initialSofaModels: ({ id: string; model_name: string })[];
    initialBedModels: ({ id: string; model_name: string })[];
}) => {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
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
                    {selectedCustomer && <input type="hidden" name="selectedCustomerId" value={selectedCustomer.id} />}
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
                        <OrderSummary itemCount={orderItems.reduce((sum, item) => sum + item.quantity, 0)} disabled={hasNameError || !selectedCustomer} />
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


const CustomerSelector = ({ customer, onSelect }: { customer: Customer | null, onSelect: (customer: Customer | null) => void }) => {
    const [isSearching, setIsSearching] = useState(!customer);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchQuery.length > 1) {
            setIsLoading(true);
            const timer = setTimeout(async () => {
                const results = await searchCustomers(searchQuery);
                type RawCustomer = {
                    id: string;
                    customer_name: string;
                    email: string;
                    company: string | null;
                    address: string;
                    mobile_number: string;
                    customer_type: 'b2b' | 'b2c' | 'architecture' | 'interior design';
                    created_at: string;
                };
                const formattedResults: Customer[] = results.map((c: RawCustomer) => ({
                    id: c.id,
                    name: c.customer_name,
                    email: c.email,
                    company: c.company || 'N/A',
                    address: c.address,
                    phone: c.mobile_number,
                    customerType: c.customer_type,
                    dateAdded: new Date(c.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    }),
                    avatar: `https://i.pravatar.cc/150?u=${c.id}`,
                    totalOrders: 0,
                    totalSpend: 0,
                    lastOrder: 'N/A',
                    status: 'Active'
                }));
                setSearchResults(formattedResults);
                setIsLoading(false);
            }, 500); // Debounce search
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearching(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchRef]);


    const handleSelectCustomer = (selected: Customer) => {
        onSelect(selected);
        setIsSearching(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleClearCustomer = () => {
        onSelect(null);
        setIsSearching(true);
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md" ref={searchRef}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-gray-800">Customer</h3>
                {customer && !isSearching && (
                    <button type='button' onClick={handleClearCustomer} className="text-red-600 font-semibold text-sm">Change</button>
                )}
            </div>

            {isSearching ? (
                <div className="relative">
                    <div className="flex items-center">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by name, phone, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-full"
                            autoFocus
                        />
                         {customer && <button type="button" onClick={() => setIsSearching(false)} className="ml-2 p-1 text-gray-500 hover:text-gray-800">
                            <X size={20} />
                        </button>}
                    </div>
                    {isLoading && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
                    {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {searchResults.map((result) => (
                                <div
                                    key={result.id}
                                    onClick={() => handleSelectCustomer(result)}
                                    className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                                >
                                    <Image src={result.avatar || `https://placehold.co/100x100/E9D5FF/4C1D95?text=A`} alt="Avatar" width={40} height={40} className="w-10 h-10 rounded-full mr-3" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{result.name}</p>
                                        <p className="text-sm text-gray-500">{result.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {searchQuery.length > 1 && !isLoading && searchResults.length === 0 && (
                        <p className="text-sm text-gray-500 mt-2">No customers found.</p>
                    )}
                </div>
            ) : customer ? (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Image src={customer.avatar || `https://placehold.co/100x100/E9D5FF/4C1D95?text=A`} alt="Customer Avatar" width={48} height={48} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                        <p className="font-semibold text-gray-800">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.company}</p>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

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
