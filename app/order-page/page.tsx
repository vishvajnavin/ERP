"use client";
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { submitOrder } from '@/actions/submit-order';

export default function OrderPage() {
  interface Customer {
    id: string;
    customer_name: string;
    // Add other fields as needed based on your customer_details table
  }
  const [customers, setCustomers] = useState<Customer[]>([]);
  interface SofaModel {
    id: string;
    model_name: string;
    // Add other fields as needed based on your sofa_products table
  }
  const [sofaModels, setSofaModels] = useState<SofaModel[]>([]);
  interface BedModel {
    id: string;
    model_name: string;
    // Add other fields as needed based on your bed_products table
  }
  const [bedModels, setBedModels] = useState<BedModel[]>([]);

  interface Product {
    product_type?: 'sofa' | 'bed';
    is_existing_model?: boolean;
    quantity?: number;
    // For existing models
    sofa_product_id?: string;
    bed_product_id?: string;
    // For new sofa
    model_name?: string;
    reference_image_url?: string;
    measurement_drawing_url?: string;
    description?: string;
    recliner_mechanism_mode?: string;
    recliner_mechanism_flip?: string;
    wood_to_floor?: boolean;
    headrest_mode?: string;
    cup_holder?: string;
    snack_swivel_tray?: boolean;
    daybed_headrest_mode?: string;
    daybed_position?: string;
    armrest_storage?: boolean;
    storage_side?: string;
    foam_density_seating?: number | string;
    foam_density_backrest?: number | string;
    belt_details?: string;
    leg_type?: string;
    pvd_color?: string;
    chester_option?: string;
    armrest_panels?: string;
    polish_color?: string;
    polish_finish?: string;
    seat_width?: number | string;
    seat_depth?: number | string;
    seat_height?: number | string;
    armrest_width?: number | string;
    armrest_depth?: number | string;
    upholstery?: string;
    upholstery_color?: string;
    total_width?: number | string;
    total_depth?: number | string;
    total_height?: number | string;
    // For new bed
    bed_size?: string;
    customized_mattress_size?: string;
    headboard_type?: string;
    storage_option?: string;
    bed_portion?: string;
  }

  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [totalProducts, setTotalProducts] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const supabase = createClient();

  const fetchInitialData = useCallback(async () => {
    const { data: customerData } = await supabase.from('customer_details').select('*');
    const { data: sofaData } = await supabase.from('sofa_products').select('*');
    const { data: bedData } = await supabase.from('bed_products').select('*');

    setCustomers(customerData || []);
    setSofaModels(sofaData || []);
    setBedModels(bedData || []);
  }, [supabase]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleProductChange = (index: number, field: string, value: string | number | boolean | undefined) => {
    const updated = [...products];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setProducts(updated);
  };

  const renderSofaDetailsForm = (index: number) => {
  const product = products[index] || {};
  return (
    <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <Input placeholder="Model Name" value={product.model_name || ''} onChange={(e) => handleProductChange(index, 'model_name', e.target.value)} />
      <Input placeholder="Reference Image URL" value={product.reference_image_url || ''} onChange={(e) => handleProductChange(index, 'reference_image_url', e.target.value)} />
      <Input placeholder="Measurement Drawing URL" value={product.measurement_drawing_url || ''} onChange={(e) => handleProductChange(index, 'measurement_drawing_url', e.target.value)} />
      <Textarea placeholder="Description" value={product.description || ''} onChange={(e) => handleProductChange(index, 'description', e.target.value)} />

      <Select value={product.recliner_mechanism_mode || ''} onValueChange={(val) => handleProductChange(index, 'recliner_mechanism_mode', val)}>
        <SelectTrigger><SelectValue placeholder="Recliner Mechanism Mode" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="motorized_single">Motorized Single</SelectItem>
          <SelectItem value="motorized_double">Motorized Double</SelectItem>
        </SelectContent>
      </Select>

      <Select value={product.recliner_mechanism_flip || ''} onValueChange={(val) => handleProductChange(index, 'recliner_mechanism_flip', val)}>
        <SelectTrigger><SelectValue placeholder="Recliner Mechanism Flip" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="single_flip">Single Flip</SelectItem>
          <SelectItem value="double_flip">Double Flip</SelectItem>
          <SelectItem value="double_motor_with_headrest">Double Motor with Headrest</SelectItem>
        </SelectContent>
      </Select>

      <Select value={product.wood_to_floor ? 'true' : 'false'} onValueChange={(val) => handleProductChange(index, 'wood_to_floor', val === 'true')}>
        <SelectTrigger><SelectValue placeholder="Wood to Floor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Wood to Floor</SelectItem>
          <SelectItem value="false">Metal to Floor</SelectItem>
        </SelectContent>
      </Select>

      <Select value={product.headrest_mode || ''} onValueChange={(val) => handleProductChange(index, 'headrest_mode', val)}>
        <SelectTrigger><SelectValue placeholder="Headrest Mode" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="motorized">Motorized</SelectItem>
        </SelectContent>
      </Select>

      <Select value={product.cup_holder || ''} onValueChange={(val) => handleProductChange(index, 'cup_holder', val)}>
        <SelectTrigger><SelectValue placeholder="Cup Holder" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="normal_push_back">Normal Push Back</SelectItem>
          <SelectItem value="chiller_cup">Chiller Cup</SelectItem>
        </SelectContent>
      </Select>

      <Select value={product.snack_swivel_tray ? 'true' : 'false'} onValueChange={(val) => handleProductChange(index, 'snack_swivel_tray', val === 'true')}>
        <SelectTrigger><SelectValue placeholder="Snack Swivel Tray" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Yes</SelectItem>
          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>

      <Select value={product.daybed_headrest_mode || ''} onValueChange={(val) => handleProductChange(index, 'daybed_headrest_mode', val)}>
        <SelectTrigger><SelectValue placeholder="Daybed Headrest Mode" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="motorized">Motorized</SelectItem>
        </SelectContent>
      </Select>

      <Select value={product.daybed_position || ''} onValueChange={(val) => handleProductChange(index, 'daybed_position', val)}>
        <SelectTrigger><SelectValue placeholder="Daybed Position" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="rhs">RHS</SelectItem>
          <SelectItem value="lhs">LHS</SelectItem>
        </SelectContent>
      </Select>

      <Select value={product.armrest_storage ? 'true' : 'false'} onValueChange={(val) => handleProductChange(index, 'armrest_storage', val === 'true')}>
        <SelectTrigger><SelectValue placeholder="Armrest Storage" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Yes</SelectItem>
          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>

      <Select value={product.storage_side || ''} onValueChange={(val) => handleProductChange(index, 'storage_side', val)}>
        <SelectTrigger><SelectValue placeholder="Storage Side" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="rhs_arm">RHS Arm</SelectItem>
          <SelectItem value="lhs_arm">LHS Arm</SelectItem>
          <SelectItem value="both_arm">Both Arms</SelectItem>
        </SelectContent>
      </Select>

      <Input placeholder="Foam Density Seating" type="number" value={product.foam_density_seating || ''} onChange={(e) => handleProductChange(index, 'foam_density_seating', e.target.value)} />
      <Input placeholder="Foam Density Backrest" type="number" value={product.foam_density_backrest || ''} onChange={(e) => handleProductChange(index, 'foam_density_backrest', e.target.value)} />

      <Select value={product.belt_details || ''} onValueChange={(val) => handleProductChange(index, 'belt_details', val)}>
        <SelectTrigger><SelectValue placeholder="Belt Details" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="elastic_belt">Elastic Belt</SelectItem>
          <SelectItem value="zig_zag_spring">Zig Zag Spring</SelectItem>
          <SelectItem value="pocket_spring">Pocket Spring</SelectItem>
        </SelectContent>
      </Select>

      <Select value={product.leg_type || ''} onValueChange={(val) => handleProductChange(index, 'leg_type', val)}>
        <SelectTrigger><SelectValue placeholder="Leg Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="wood">Wood</SelectItem>
          <SelectItem value="pvd">PVD</SelectItem>
          <SelectItem value="ss">SS</SelectItem>
        </SelectContent>
      </Select>

      <Input placeholder="PVD Color" value={product.pvd_color || ''} onChange={(e) => handleProductChange(index, 'pvd_color', e.target.value)} />

      <Select value={product.chester_option || ''} onValueChange={(val) => handleProductChange(index, 'chester_option', val)}>
        <SelectTrigger><SelectValue placeholder="Chester Option" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="with_button">With Button</SelectItem>
          <SelectItem value="without_button">Without Button</SelectItem>
        </SelectContent>
      </Select>

      <Input placeholder="Armrest Panels" value={product.armrest_panels || ''} onChange={(e) => handleProductChange(index, 'armrest_panels', e.target.value)} />
      <Input placeholder="Polish Color" value={product.polish_color || ''} onChange={(e) => handleProductChange(index, 'polish_color', e.target.value)} />

      <Select value={product.polish_finish || ''} onValueChange={(val) => handleProductChange(index, 'polish_finish', val)}>
        <SelectTrigger><SelectValue placeholder="Polish Finish" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="matt_finish">Matt Finish</SelectItem>
          <SelectItem value="glossy_finish">Glossy Finish</SelectItem>
        </SelectContent>
      </Select>

      <Input placeholder="Total Width" type="number" value={product.total_width || ''} onChange={(e) => handleProductChange(index, 'total_width', e.target.value)} />
      <Input placeholder="Total Depth" type="number" value={product.total_depth || ''} onChange={(e) => handleProductChange(index, 'total_depth', e.target.value)} />
      <Input placeholder="Total Height" type="number" value={product.total_height || ''} onChange={(e) => handleProductChange(index, 'total_height', e.target.value)} />
      <Input placeholder="Seat Width" type="number" value={product.seat_width || ''} onChange={(e) => handleProductChange(index, 'seat_width', e.target.value)} />
      <Input placeholder="Seat Depth" type="number" value={product.seat_depth || ''} onChange={(e) => handleProductChange(index, 'seat_depth', e.target.value)} />
      <Input placeholder="Seat Height" type="number" value={product.seat_height || ''} onChange={(e) => handleProductChange(index, 'seat_height', e.target.value)} />
      <Input placeholder="Armrest Width" type="number" value={product.armrest_width || ''} onChange={(e) => handleProductChange(index, 'armrest_width', e.target.value)} />
      <Input placeholder="Armrest Depth" type="number" value={product.armrest_depth || ''} onChange={(e) => handleProductChange(index, 'armrest_depth', e.target.value)} />

      <Select value={product.upholstery || ''} onValueChange={(val) => handleProductChange(index, 'upholstery', val)}>
        <SelectTrigger><SelectValue placeholder="Upholstery" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="fabric">Fabric</SelectItem>
          <SelectItem value="pu">PU</SelectItem>
          <SelectItem value="leather_bloom">Leather Bloom</SelectItem>
          <SelectItem value="leather_floater">Leather Floater</SelectItem>
          <SelectItem value="leather_floater_max">Leather Floater Max</SelectItem>
          <SelectItem value="leather_platinum_max">Leather Platinum Max</SelectItem>
          <SelectItem value="leather_european_nappa">Leather European Nappa</SelectItem>
          <SelectItem value="leather_smoothy_nappa">Leather Smoothy Nappa</SelectItem>
          <SelectItem value="pu_leather">PU Leather</SelectItem>
        </SelectContent>
      </Select>

      <Input placeholder="Upholstery Color" value={product.upholstery_color || ''} onChange={(e) => handleProductChange(index, 'upholstery_color', e.target.value)} />
    </form>
  );
};

  const renderBedDetailsForm = (index: number) => {
    const product = products[index] || {};
    return (
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Input placeholder="Model Name" value={product.model_name || ''} onChange={(e) => handleProductChange(index, 'model_name', e.target.value)} />
        <Input placeholder="Reference Image URL" value={product.reference_image_url || ''} onChange={(e) => handleProductChange(index, 'reference_image_url', e.target.value)} />
        <Input placeholder="Measurement Drawing URL" value={product.measurement_drawing_url || ''} onChange={(e) => handleProductChange(index, 'measurement_drawing_url', e.target.value)} />
        <Textarea placeholder="Description" value={product.description || ''} onChange={(e) => handleProductChange(index, 'description', e.target.value)} />

        <Select value={product.bed_size || ''} onValueChange={(val) => handleProductChange(index, 'bed_size', val)}>
          <SelectTrigger><SelectValue placeholder="Bed Size" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="king">King</SelectItem>
            <SelectItem value="queen">Queen</SelectItem>
            <SelectItem value="customized">Customized</SelectItem>
          </SelectContent>
        </Select>

        {product.bed_size === 'customized' && (
          <Input placeholder="Custom Mattress Size" value={product.customized_mattress_size || ''} onChange={(e) => handleProductChange(index, 'customized_mattress_size', e.target.value)} />
        )}

        <Select value={product.headboard_type || ''} onValueChange={(val) => handleProductChange(index, 'headboard_type', val)}>
          <SelectTrigger><SelectValue placeholder="Headboard Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="medium_back_4ft">Medium Back 4ft</SelectItem>
            <SelectItem value="high_back_4_5ft">High Back 4.5ft</SelectItem>
          </SelectContent>
        </Select>

        <Select value={product.storage_option || ''} onValueChange={(val) => handleProductChange(index, 'storage_option', val)}>
          <SelectTrigger><SelectValue placeholder="Storage Option" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="hydraulic">Hydraulic</SelectItem>
            <SelectItem value="channel">Channel</SelectItem>
            <SelectItem value="motorised">Motorised</SelectItem>
            <SelectItem value="without_storage">Without Storage</SelectItem>
          </SelectContent>
        </Select>

        <Select value={product.bed_portion || ''} onValueChange={(val) => handleProductChange(index, 'bed_portion', val)}>
          <SelectTrigger><SelectValue placeholder="Bed Portion" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="double">Double</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Total Width" type="number" value={product.total_width || ''} onChange={(e) => handleProductChange(index, 'total_width', e.target.value)} />
        <Input placeholder="Total Depth" type="number" value={product.total_depth || ''} onChange={(e) => handleProductChange(index, 'total_depth', e.target.value)} />
        <Input placeholder="Total Height" type="number" value={product.total_height || ''} onChange={(e) => handleProductChange(index, 'total_height', e.target.value)} />

        <Select value={product.upholstery || ''} onValueChange={(val) => handleProductChange(index, 'upholstery', val)}>
          <SelectTrigger><SelectValue placeholder="Upholstery" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="fabric">Fabric</SelectItem>
            <SelectItem value="pu">PU</SelectItem>
            <SelectItem value="leather_bloom">Leather Bloom</SelectItem>
            <SelectItem value="leather_floater">Leather Floater</SelectItem>
            <SelectItem value="leather_floater_max">Leather Floater Max</SelectItem>
            <SelectItem value="leather_platinum_max">Leather Platinum Max</SelectItem>
            <SelectItem value="leather_european_nappa">Leather European Nappa</SelectItem>
            <SelectItem value="leather_smoothy_nappa">Leather Smoothy Nappa</SelectItem>
            <SelectItem value="pu_leather">PU Leather</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Upholstery Color" value={product.upholstery_color || ''} onChange={(e) => handleProductChange(index, 'upholstery_color', e.target.value)} />
        <Input placeholder="Polish Color" value={product.polish_color || ''} onChange={(e) => handleProductChange(index, 'polish_color', e.target.value)} />

        <Select value={product.polish_finish || ''} onValueChange={(val) => handleProductChange(index, 'polish_finish', val)}>
          <SelectTrigger><SelectValue placeholder="Polish Finish" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="matt_finish">Matt Finish</SelectItem>
            <SelectItem value="glossy_finish">Glossy Finish</SelectItem>
          </SelectContent>
        </Select>
      </form>
    );
  };

  const renderProductForm = (index: number) => {
    const product = products[index] || {};
    return (
      <Card key={index} className="p-4 my-4">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </form>

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
            <SelectTrigger>
              <SelectValue placeholder="Select Bed Model" />
            </SelectTrigger>
            <SelectContent>
              {bedModels.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {product.product_type === 'sofa' && !product.is_existing_model && renderSofaDetailsForm(index)}
        {product.product_type === 'bed' && !product.is_existing_model && renderBedDetailsForm(index)}
      </Card>
    );
  };

  useEffect(() => {
    setProducts(prevProducts => Array.from({ length: totalProducts }, (_, i) => prevProducts[i] || {}));
  }, [totalProducts]);

  function handleSubmit(){
    submitOrder({selectedCustomer,totalProducts,products})
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Place Order</h1>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
          <SelectTrigger>
            <SelectValue placeholder="Select Customer" />
          </SelectTrigger>
          <SelectContent>
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
      </form>

      {products.map((_, index) => renderProductForm(index))}

      <Button className="mt-6" onClick={submitOrder}>
        Submit Order
      </Button>
    </div>
  );
}