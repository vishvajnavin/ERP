"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem,SelectTrigger,SelectValue,SelectContent } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function OrderPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [sofaModels, setSofaModels] = useState<any[]>([]);
  const [bedModels, setBedModels] = useState<any[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [totalProducts, setTotalProducts] = useState<number>(1);
  const [products, setProducts] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const { data: customerData } = await supabase.from('customer_details').select('*');
    const { data: sofaData } = await supabase.from('sofa_products').select('*');
    const { data: bedData } = await supabase.from('bed_products').select('*');

    setCustomers(customerData || []);
    setSofaModels(sofaData || []);
    setBedModels(bedData || []);
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...products];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setProducts(updated);
  };

  const renderProductForm = (index: number) => {
    const product = products[index] || {};
    return (
      <Card key={index} className="p-4 my-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
  value={product.product_type || ''}
  onValueChange={(val) => handleProductChange(index, 'product_type', val)}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Product Type" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="sofa">Sofa</SelectItem>
    <SelectItem value="bed">Bed</SelectItem>
  </SelectContent>
</Select>
          <Select
  value={product.is_existing_model ? 'existing' : 'new'}
  onValueChange={(val) => handleProductChange(index, 'is_existing_model', val === 'existing')}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Existing or New" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="existing">Existing Model</SelectItem>
    <SelectItem value="new">New Custom Specification</SelectItem>
  </SelectContent>
</Select>

          <Input
            type="number"
            min={1}
            placeholder="Quantity"
            value={product.quantity || 1}
            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
          />

          {product.product_type === 'sofa' && product.is_existing_model && (
            <Select
  value={product.sofa_product_id || ''}
  onValueChange={(val) => handleProductChange(index, 'sofa_product_id', val)}
>
  <SelectTrigger>
    <SelectValue placeholder="Select Sofa Model" />
  </SelectTrigger>

  <SelectContent>
    {sofaModels.map((m) => (
      <SelectItem key={m.id} value={m.id}>
        {m.model_name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          )}

          {product.product_type === 'bed' && product.is_existing_model && (
            <Select
              value={product.bed_product_id || ''}
              onValueChange={(val) => handleProductChange(index, 'bed_product_id', val)}
            >
              <SelectItem value="" disabled>Select Bed Model</SelectItem>
              {bedModels.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.model_name}</SelectItem>
              ))}
            </Select>
          )}

          {!product.is_existing_model && (
            <Textarea
              placeholder="Enter Custom Specifications (JSON Format)"
              value={product.custom_specifications || ''}
              onChange={(e) => handleProductChange(index, 'custom_specifications', e.target.value)}
            />
          )}
        </div>
      </Card>
    );
  };

  const submitOrder = async () => {
    if (!selectedCustomer || totalProducts < 1) return;

    const { data: order } = await supabase.from('orders').insert({
      customer_id: selectedCustomer,
      total_products: totalProducts,
    }).select().single();

    if (order) {
      for (const item of products) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          product_type: item.product_type,
          is_existing_model: item.is_existing_model,
          sofa_product_id: item.product_type === 'sofa' && item.is_existing_model ? item.sofa_product_id : null,
          bed_product_id: item.product_type === 'bed' && item.is_existing_model ? item.bed_product_id : null,
          custom_specifications: item.is_existing_model ? null : item.custom_specifications,
          quantity: item.quantity || 1,
        });
      }
      alert('Order placed successfully!');
      setProducts([]);
      setTotalProducts(1);
    }
  };

  useEffect(() => {
    setProducts(Array.from({ length: totalProducts }, (_, i) => products[i] || {}));
  }, [totalProducts]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Place Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
  <SelectTrigger>
    <SelectValue placeholder="Select Customer" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="placeholder" disabled>
      Select Customer
    </SelectItem>
    {customers.map((c) => (
      <SelectItem key={c.id} value={c.id}>
        {c.customer_name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

        <Input
          type="number"
          min={1}
          placeholder="Number of Products"
          value={totalProducts}
          onChange={(e) => setTotalProducts(parseInt(e.target.value))}
        />
      </div>

      {products.map((_, index) => renderProductForm(index))}

      <Button className="mt-6" onClick={submitOrder}>
        Submit Order
      </Button>
    </div>
  );
}
