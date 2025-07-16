import { SofaDetailsForm } from "./sofa-details-form";
import { BedDetailsForm } from "./bed-details-form";
import { useState } from "react";
import { OrderItem } from "./order-page-client";
import { Product } from "@/types/products";
import { Search, Plus, Minus, Sofa, Bed, Trash2 } from 'lucide-react'

type ProductEntryFormProps = {
    item: OrderItem;
    index: number;
    onItemChange: <K extends keyof OrderItem>(index: number, field: K, value: OrderItem[K]) => void;
    onDetailsChange: <K extends keyof Product>(index: number, detailField: K, value: Product[K]) => void;
    onProductSelect: (index: number, product: { id: string; type: 'Sofa' | 'Bed'; model_name: string; }) => void;
    onRemove: (index: number) => void;
    isOnlyItem: boolean;
    sofaModels: { id: string; model_name: string; }[];
    bedModels: { id: string; model_name: string; }[];
};

export const ProductEntryForm = ({ item, index, onItemChange, onDetailsChange, onProductSelect, onRemove, isOnlyItem, sofaModels, bedModels }: ProductEntryFormProps) => {
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const filteredProducts = item.type === 'Sofa' ? sofaModels.filter(p =>
        p.model_name.toLowerCase().includes(search.toLowerCase())||
        p.id.toString().includes(search)
    ) : bedModels.filter(p =>
        p.model_name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toString().includes(search)
    );

    // Construct the base name for input fields in this product entry
    const baseName = `products[${index}]`;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md relative">
            {/* Hidden inputs to structure the form data for the server action */}
            <input type="hidden" name={`${baseName}.product_type`} value={item.type.toLowerCase()} />
            <input type="hidden" name={`${baseName}.is_existing_model`} value={String(!!item.id)} />
            <input type="hidden" name={`${baseName}.is_customization`} value={String(item.isCustom)} />
            {item.id && <input type="hidden" name={`${baseName}.${item.type === 'Sofa' ? 'sofa_product_id' : 'bed_product_id'}`} value={item.id} />}
            <input type="hidden" name={`${baseName}.quantity`} value={item.quantity} />

            {!isOnlyItem && (
                <button type="button" onClick={() => onRemove(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
                    <Trash2 size={20} />
                </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button type="button" onClick={() => onItemChange(index, 'type', 'Sofa')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition ${item.type === 'Sofa' ? 'bg-white shadow' : ''}`}><Sofa size={18} /> Sofa</button>
                    <button type="button" onClick={() => onItemChange(index, 'type', 'Bed')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition ${item.type === 'Bed' ? 'bg-white shadow' : ''}`}><Bed size={18} /> Bed</button>
                </div>
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search existing ${item.type.toLowerCase()} models...`}
                        value={item.id ? item.model_name : search}
                        onChange={e => {
                            setSearch(e.target.value);
                            onItemChange(index, 'id', null);
                            onDetailsChange(index, 'model_name', e.target.value);
                        }}
                        onFocus={() => setIsSearching(true)}
                        onBlur={() => setTimeout(() => setIsSearching(false), 200)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                    {isSearching && search && (
                        <div className="absolute z-10 top-full mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredProducts.length > 0 ? filteredProducts.map(p => (
                                <div key={p.id} onClick={() => {
                                        onProductSelect(index,{...p, type: item.type, })
                                    setSearch(p.model_name); 
                                    setIsSearching(false); 
                                }} 
                                className="p-3 hover:bg-red-50 cursor-pointer">{p.model_name}</div>
                            )) : <div className="p-3 text-gray-500">No models found.</div>}
                        </div>
                    )}
                </div>
            </div>
            <div className={`p-4 border-t-2 ${item.isCustom ? 'border-red-200' : 'border-gray-200'} transition`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-700">Product Details</h3>
                    <div className="flex items-center gap-2">
                        <span className={`font-semibold ${item.isCustom ? 'text-red-600' : 'text-gray-500'}`}>Customize</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={item.isCustom} onChange={e => onItemChange(index, 'isCustom', e.target.checked)} className="sr-only peer" disabled={!item.id && !item.details.model_name?.trim()} />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                </div>
                {/* Pass the baseName prop to the details forms */}
                {item.type === 'Sofa' && <SofaDetailsForm baseName={baseName} index={index} product={item.details} handleProductChange={onDetailsChange} disabled={!item.isCustom} />}
                {item.type === 'Bed' && <BedDetailsForm baseName={baseName} index={index} product={item.details} handleProductChange={onDetailsChange} disabled={!item.isCustom} />}
            </div>
            <div className="flex justify-end items-center mt-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-600">Quantity</span>
                    <div className="flex items-center">
                        <button type="button" onClick={() => onItemChange(index, 'quantity', Math.max(1, item.quantity - 1))} className="p-2 bg-gray-200 rounded-full"><Minus size={16} /></button>
                        <span className="w-16 text-center font-bold text-lg">{item.quantity}</span>
                        <button type="button" onClick={() => onItemChange(index, 'quantity', item.quantity + 1)} className="p-2 bg-gray-200 rounded-full"><Plus size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};
