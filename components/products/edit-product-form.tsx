// components/products/edit-product-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProductAction } from '@/actions/update-product';
import { Button } from '@/components/ui/button';
import { ToggleGroupField, InputField, type ToggleOption } from './fields';
import { toast } from 'sonner';
import { Product } from '@/types/products';

type ProductType = 'sofa' | 'bed';

// Helper function to create options for ToggleGroupField
const createOptions = (values: string[]): ToggleOption<string>[] =>
  values.map(v => ({ label: v.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value: v }));

const booleanOptions: ToggleOption<boolean>[] = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Updating Product...' : 'Update Product'}
    </Button>
  );
}

export default function EditProductForm({ onClose, product }: { onClose: () => void, product: Product }) {
  const [productType, setProductType] = useState<ProductType>(product.product_type as ProductType);
  const [toggleValues, setToggleValues] = useState<Record<string, string | boolean>>({});

  useEffect(() => {
    if (product) {
      setProductType(product.product_type as ProductType);
      const initialToggleValues: Record<string, string | boolean> = {
        recliner_mechanism_mode: product.recliner_mechanism_mode || '',
        recliner_mechanism_flip: product.recliner_mechanism_flip || '',
        headrest_mode: product.headrest_mode || '',
        cup_holder: product.cup_holder || '',
        daybed_headrest_mode: product.daybed_headrest_mode || '',
        daybed_position: product.daybed_position || '',
        storage_side: product.storage_side || '',
        snack_swivel_tray: product.snack_swivel_tray || false,
        armrest_storage: product.armrest_storage || false,
        belt_details: product.belt_details || '',
        leg_type: product.leg_type || '',
        chester_option: product.chester_option || '',
        wood_to_floor: product.wood_to_floor || false,
        bed_size: product.bed_size || '',
        storage_option: product.storage_option || '',
        headboard_type: product.headboard_type || '',
        upholstery: product.upholstery || '',
        polish_finish: product.polish_finish || '',
      };
      setToggleValues(initialToggleValues);
    }
  }, [product]);

  const formAction = async (formData: FormData) => {
    const result = await updateProductAction(formData);
    if (result.success) {
        toast.success(result.message);
        onClose(); // Close modal on success
    } else {
        toast.error(result.message);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="product_id" value={product.id} />
      {/* --- PRODUCT TYPE SELECTOR --- */}
      <ToggleGroupField
        name="product_type"
        label="Product Type"
        value={productType}
        onValueChange={(value) => setProductType(value as ProductType)}
        disabled={false}
        options={[ { label: 'Sofa', value: 'sofa' }, { label: 'Bed', value: 'bed' } ]}
      />
      
      <div className="space-y-4 border-t pt-6">
        {/* --- COMMON FIELDS --- */}
        <h3 className="text-lg font-semibold col-span-full">General Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField label="Model Name" name="model_name" placeholder="e.g. Royal Oak King" defaultValue={product.model_name} />
            <InputField label="Description" name="description" placeholder="A brief description" defaultValue={product.description} />
            <InputField label="Reference Image URL" name="reference_image_url" placeholder="https://example.com/image.jpg" defaultValue={product.reference_image_url} />
            <InputField label="Measurement Drawing URL" name="measurement_drawing_url" placeholder="https://example.com/drawing.jpg" defaultValue={product.measurement_drawing_url} />
        </div>

        {/* --- CONDITIONAL SOFA FIELDS --- */}
        {productType === 'sofa' && (
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold col-span-full">Mechanism Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ToggleGroupField name="recliner_mechanism_mode" label="Recliner Mechanism" value={toggleValues.recliner_mechanism_mode} onValueChange={(v) => setToggleValues(prev => ({...prev, recliner_mechanism_mode: v}))} disabled={false} options={createOptions(['manual', 'motorized_single', 'motorized_double'])} />
                <ToggleGroupField name="recliner_mechanism_flip" label="Recliner Flip" value={toggleValues.recliner_mechanism_flip} onValueChange={(v) => setToggleValues(prev => ({...prev, recliner_mechanism_flip: v}))} disabled={false} options={createOptions(['single_flip', 'double_flip', 'double_motor_with_headrest'])} />
                <ToggleGroupField name="headrest_mode" label="Headrest Mode" value={toggleValues.headrest_mode} onValueChange={(v) => setToggleValues(prev => ({...prev, headrest_mode: v}))} disabled={false} options={createOptions(['manual', 'motorized'])} />
                <ToggleGroupField name="cup_holder" label="Cup Holder" value={toggleValues.cup_holder} onValueChange={(v) => setToggleValues(prev => ({...prev, cup_holder: v}))} disabled={false} options={createOptions(['normal_push_back', 'chiller_cup'])} />
                <ToggleGroupField name="daybed_headrest_mode" label="Daybed Headrest" value={toggleValues.daybed_headrest_mode} onValueChange={(v) => setToggleValues(prev => ({...prev, daybed_headrest_mode: v}))} disabled={false} options={createOptions(['manual', 'motorized'])} />
                <ToggleGroupField name="daybed_position" label="Daybed Position" value={toggleValues.daybed_position} onValueChange={(v) => setToggleValues(prev => ({...prev, daybed_position: v}))} disabled={false} options={createOptions(['rhs', 'lhs'])} />
                <ToggleGroupField name="storage_side" label="Armrest Storage Side" value={toggleValues.storage_side} onValueChange={(v) => setToggleValues(prev => ({...prev, storage_side: v}))} disabled={false} options={createOptions(['rhs_arm', 'lhs_arm', 'both_arm'])} />
                <ToggleGroupField name="snack_swivel_tray" label="Snack Swivel Tray" value={toggleValues.snack_swivel_tray} onValueChange={(v) => setToggleValues(prev => ({...prev, snack_swivel_tray: v}))} disabled={false} options={booleanOptions} />
                <ToggleGroupField name="armrest_storage" label="Has Armrest Storage" value={toggleValues.armrest_storage} onValueChange={(v) => setToggleValues(prev => ({...prev, armrest_storage: v}))} disabled={false} options={booleanOptions} />
            </div>

            <h3 className="text-lg font-semibold col-span-full pt-4">Comfort & Cushion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField label="Foam Density (Seating)" name="foam_density_seating" type="number" step="0.01" placeholder="e.g. 32.50" defaultValue={product.foam_density_seating} />
                <InputField label="Foam Density (Backrest)" name="foam_density_backrest" type="number" step="0.01" placeholder="e.g. 28.00" defaultValue={product.foam_density_backrest} />
                <ToggleGroupField name="belt_details" label="Support System" value={toggleValues.belt_details} onValueChange={(v) => setToggleValues(prev => ({...prev, belt_details: v}))} disabled={false} options={createOptions(['elastic_belt', 'zig_zag_spring', 'pocket_spring'])} />
            </div>

            <h3 className="text-lg font-semibold col-span-full pt-4">Legs & Finishes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ToggleGroupField name="leg_type" label="Leg Type" value={toggleValues.leg_type} onValueChange={(v) => setToggleValues(prev => ({...prev, leg_type: v}))} disabled={false} options={createOptions(['wood', 'pvd', 'ss'])} />
                <InputField label="PVD Color" name="pvd_color" placeholder="e.g. Gold, Rose Gold" defaultValue={product.pvd_color} />
                <ToggleGroupField name="chester_option" label="Chesterfield Buttons" value={toggleValues.chester_option} onValueChange={(v) => setToggleValues(prev => ({...prev, chester_option: v}))} disabled={false} options={createOptions(['with_button', 'without_button'])} />
                <InputField label="Armrest Panel Details" name="armrest_panels" placeholder="e.g. Vertical lines" defaultValue={product.armrest_panels} />
                <ToggleGroupField name="wood_to_floor" label="Wood to Floor" value={toggleValues.wood_to_floor} onValueChange={(v) => setToggleValues(prev => ({...prev, wood_to_floor: v}))} disabled={false} options={booleanOptions} />
            </div>

            <h3 className="text-lg font-semibold col-span-full pt-4">Dimensions (in.)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputField label="Total Width" name="total_width" type="number" step="0.01" placeholder="e.g. 84.50" defaultValue={product.total_width} />
                <InputField label="Total Depth" name="total_depth" type="number" step="0.01" placeholder="e.g. 40.00" defaultValue={product.total_depth} />
                <InputField label="Total Height" name="total_height" type="number" step="0.01" placeholder="e.g. 38.00" defaultValue={product.total_height} />
                <InputField label="Seat Height" name="seat_height" type="number" step="0.01" placeholder="e.g. 18.00" defaultValue={product.seat_height} />
                <InputField label="Seat Depth" name="seat_depth" type="number" step="0.01" placeholder="e.g. 22.50" defaultValue={product.seat_depth} />
                <InputField label="Seat Width" name="seat_width" type="number" step="0.01" placeholder="e.g. 70.00" defaultValue={product.seat_width} />
                <InputField label="Armrest Width" name="armrest_width" type="number" step="0.01" placeholder="e.g. 7.25" defaultValue={product.armrest_width} />
                <InputField label="Armrest Depth" name="armrest_depth" type="number" step="0.01" placeholder="e.g. 38.00" defaultValue={product.armrest_depth} />
            </div>
          </div>
        )}

        {/* --- CONDITIONAL BED FIELDS --- */}
        {productType === 'bed' && (
           <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold col-span-full">Bed Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ToggleGroupField name="bed_size" label="Bed Size" value={toggleValues.bed_size} onValueChange={(v) => setToggleValues(prev => ({...prev, bed_size: v}))} disabled={false} options={createOptions(['king', 'queen', 'customized'])} />
                <ToggleGroupField name="storage_option" label="Storage Option" value={toggleValues.storage_option} onValueChange={(v) => setToggleValues(prev => ({...prev, storage_option: v}))} disabled={false} options={createOptions(['hydraulic', 'channel', 'motorised', 'without_storage'])} />
                <ToggleGroupField name="headboard_type" label="Headboard Type" value={toggleValues.headboard_type} onValueChange={(v) => setToggleValues(prev => ({...prev, headboard_type: v}))} disabled={false} options={createOptions(['medium_back_4ft', 'high_back_4_5ft'])} />
                <InputField label="Custom Mattress Size" name="customized_mattress_size" placeholder="e.g. 75x70 inches" defaultValue={product.customized_mattress_size} />
            </div>
          </div>
        )}
        
        {/* --- COMMON UPHOLSTERY & FINISH FIELDS --- */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold col-span-full">Upholstery & Finish</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ToggleGroupField name="upholstery" label="Upholstery Material" value={toggleValues.upholstery} onValueChange={(v) => setToggleValues(prev => ({...prev, upholstery: v}))} disabled={false} options={createOptions(['fabric', 'pu', 'leather_bloom', 'leather_floater', 'leather_smoothy_nappa', 'pu_leather'])} />
              <InputField label="Upholstery Color" name="upholstery_color" placeholder="e.g. Beige, Charcoal Grey" defaultValue={product.upholstery_color} />
              <ToggleGroupField name="polish_finish" label="Polish Finish" value={toggleValues.polish_finish} onValueChange={(v) => setToggleValues(prev => ({...prev, polish_finish: v}))} disabled={false} options={createOptions(['matt_finish', 'glossy_finish'])} />
              <InputField label="Polish Color" name="polish_color" placeholder="e.g. Walnut, Teak" defaultValue={product.polish_color} />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-6 border-t">
        <Button type="button" variant="ghost" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
        <SubmitButton />
      </div>
    </form>
  );
}
