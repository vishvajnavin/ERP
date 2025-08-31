// components/AddProductForm.tsx
'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { addProductAction } from '@/actions/add-product';
import { Button } from '@/components/ui/button';
import { ToggleGroupField, InputField, type ToggleOption } from './fields';
import { toast } from 'sonner';

type ProductType = 'sofa' | 'bed';

// Helper function to create options for ToggleGroupField
const createOptions = (values: string[]): ToggleOption<string>[] =>
  values.map(v => ({ label: v.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace('3+ Daybed', '3+ daybed').replace('2+ Daybed', '2+ daybed'), value: v }));

const booleanOptions: ToggleOption<boolean>[] = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Adding Product...' : 'Add Product'}
    </Button>
  );
}

export default function AddProductForm({ onClose }: { onClose: () => void }) {
  const [productType, setProductType] = useState<ProductType>('sofa');
  const [toggleValues, setToggleValues] = useState<Record<string, string | boolean>>({});
  
  const handleToggleChange = (name: string, value: string | boolean) => {
    setToggleValues(prev => ({ ...prev, [name]: value }));
  };

  const formAction = async (formData: FormData) => {
    const result = await addProductAction(formData);
    if (result.success) {
        toast.success(result.message);
        onClose(); // Close modal on success
    } else {
        toast.error(result.message);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
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
            <InputField label="Model Name" name="model_name" placeholder="e.g. Royal Oak King" />
            <InputField label="Description" name="description" placeholder="A brief description" />
            <InputField label="Reference Image URL" name="reference_image_url" placeholder="https://example.com/image.jpg" />
            <InputField label="Measurement Drawing URL" name="measurement_drawing_url" placeholder="https://example.com/drawing.jpg" />
        </div>

        {/* --- CONDITIONAL SOFA FIELDS --- */}
        {productType === 'sofa' && (
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold col-span-full">Sofa Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ToggleGroupField name="model_family_configuration" label="Model Family Configuration" value={toggleValues.model_family_configuration} onValueChange={(v) => handleToggleChange('model_family_configuration', v)} disabled={false} options={createOptions(['1 str', '2 str', '3 str', '3+2 str', '3+ daybed', '2+daybed', '3+cnr+3', '3+cnr+2', '2+cnr+2', '3+cnr+1', '2+cnr+1', '3+2+1'])} />
                {(toggleValues.model_family_configuration === '3+2 str' || toggleValues.model_family_configuration === '3+2+1') && (
                    <InputField label="2 Seater Length (in.)" name="2_seater_length" type="number" step="0.01" placeholder="e.g. 60.00" />
                )}
                {toggleValues.model_family_configuration === '3+2+1' && (
                    <InputField label="1 Seater Length (in.)" name="1_seater_length" type="number" step="0.01" placeholder="e.g. 36.00" />
                )}
            </div>
            <h3 className="text-lg font-semibold col-span-full">Mechanism Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ToggleGroupField name="recliner_mechanism_mode" label="Recliner Mechanism" value={toggleValues.recliner_mechanism_mode} onValueChange={(v) => handleToggleChange('recliner_mechanism_mode', v)} disabled={false} options={createOptions(['manual', 'motorized_single', 'motorized_double'])} />
                <ToggleGroupField name="recliner_mechanism_flip" label="Recliner Flip" value={toggleValues.recliner_mechanism_flip} onValueChange={(v) => handleToggleChange('recliner_mechanism_flip', v)} disabled={false} options={createOptions(['single_flip', 'double_flip', 'double_motor_with_headrest'])} />
                <ToggleGroupField name="headrest_mode" label="Headrest Mode" value={toggleValues.headrest_mode} onValueChange={(v) => handleToggleChange('headrest_mode', v)} disabled={false} options={createOptions(['manual', 'motorized'])} />
                <ToggleGroupField name="cup_holder" label="Cup Holder" value={toggleValues.cup_holder} onValueChange={(v) => handleToggleChange('cup_holder', v)} disabled={false} options={createOptions(['normal_push_back', 'chiller_cup'])} />
                <ToggleGroupField name="daybed_headrest_mode" label="Daybed Headrest" value={toggleValues.daybed_headrest_mode} onValueChange={(v) => handleToggleChange('daybed_headrest_mode', v)} disabled={false} options={createOptions(['manual', 'motorized'])} />
                <ToggleGroupField name="daybed_position" label="Daybed Position" value={toggleValues.daybed_position} onValueChange={(v) => handleToggleChange('daybed_position', v)} disabled={false} options={createOptions(['rhs', 'lhs'])} />
                <ToggleGroupField name="storage_side" label="Armrest Storage Side" value={toggleValues.storage_side} onValueChange={(v) => handleToggleChange('storage_side', v)} disabled={false} options={createOptions(['rhs_arm', 'lhs_arm', 'both_arm'])} />
                <ToggleGroupField name="snack_swivel_tray" label="Snack Swivel Tray" value={toggleValues.snack_swivel_tray} onValueChange={(v) => handleToggleChange('snack_swivel_tray', v)} disabled={false} options={booleanOptions} />
                <ToggleGroupField name="armrest_storage" label="Has Armrest Storage" value={toggleValues.armrest_storage} onValueChange={(v) => handleToggleChange('armrest_storage', v)} disabled={false} options={booleanOptions} />
            </div>

            <h3 className="text-lg font-semibold col-span-full pt-4">Comfort & Cushion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField label="Foam Density (Seating)" name="foam_density_seating" type="number" step="0.01" placeholder="e.g. 32.50" />
                <InputField label="Foam Density (Backrest)" name="foam_density_backrest" type="number" step="0.01" placeholder="e.g. 28.00" />
                <ToggleGroupField name="belt_details" label="Support System" value={toggleValues.belt_details} onValueChange={(v) => handleToggleChange('belt_details', v)} disabled={false} options={createOptions(['elastic_belt', 'zig_zag_spring', 'pocket_spring'])} />
            </div>

            <h3 className="text-lg font-semibold col-span-full pt-4">Legs & Finishes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ToggleGroupField name="leg_type" label="Leg Type" value={toggleValues.leg_type} onValueChange={(v) => handleToggleChange('leg_type', v)} disabled={false} options={createOptions(['wood', 'pvd', 'ss'])} />
                <InputField label="PVD Color" name="pvd_color" placeholder="e.g. Gold, Rose Gold" />
                <ToggleGroupField name="chester_option" label="Chesterfield Buttons" value={toggleValues.chester_option} onValueChange={(v) => handleToggleChange('chester_option', v)} disabled={false} options={createOptions(['with_button', 'without_button'])} />
                <InputField label="Armrest Panel Details" name="armrest_panels" placeholder="e.g. Vertical lines" />
                <ToggleGroupField name="wood_to_floor" label="Wood to Floor" value={toggleValues.wood_to_floor} onValueChange={(v) => handleToggleChange('wood_to_floor', v)} disabled={false} options={booleanOptions} />
            </div>

            <h3 className="text-lg font-semibold col-span-full pt-4">Dimensions (in.)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputField label="Total Width" name="total_width" type="number" step="0.01" placeholder="e.g. 84.50" />
                <InputField label="Total Depth" name="total_depth" type="number" step="0.01" placeholder="e.g. 40.00" />
                <InputField label="Total Height" name="total_height" type="number" step="0.01" placeholder="e.g. 38.00" />
                <InputField label="Seat Height" name="seat_height" type="number" step="0.01" placeholder="e.g. 18.00" />
                <InputField label="Seat Depth" name="seat_depth" type="number" step="0.01" placeholder="e.g. 22.50" />
                <InputField label="Seat Width" name="seat_width" type="number" step="0.01" placeholder="e.g. 70.00" />
                <InputField label="Armrest Width" name="armrest_width" type="number" step="0.01" placeholder="e.g. 7.25" />
                <InputField label="Armrest Depth" name="armrest_depth" type="number" step="0.01" placeholder="e.g. 38.00" />
            </div>
          </div>
        )}

        {/* --- CONDITIONAL BED FIELDS --- */}
        {productType === 'bed' && (
           <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold col-span-full">Bed Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ToggleGroupField name="bed_size" label="Bed Size" value={toggleValues.bed_size} onValueChange={(v) => handleToggleChange('bed_size', v)} disabled={false} options={createOptions(['king', 'queen', 'customized'])} />
                <ToggleGroupField name="storage_option" label="Storage Option" value={toggleValues.storage_option} onValueChange={(v) => handleToggleChange('storage_option', v)} disabled={false} options={createOptions(['hydraulic', 'channel', 'motorised', 'without_storage'])} />
                <ToggleGroupField name="headboard_type" label="Headboard Type" value={toggleValues.headboard_type} onValueChange={(v) => handleToggleChange('headboard_type', v)} disabled={false} options={createOptions(['medium_back_4ft', 'high_back_4_5ft'])} />
                <InputField label="Custom Mattress Size" name="customized_mattress_size" placeholder="e.g. 75x70 inches" />
            </div>
          </div>
        )}
        
        {/* --- COMMON UPHOLSTERY & FINISH FIELDS --- */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold col-span-full">Upholstery & Finish</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ToggleGroupField name="upholstery" label="Upholstery Material" value={toggleValues.upholstery} onValueChange={(v) => handleToggleChange('upholstery', v)} disabled={false} options={createOptions(['fabric', 'pu', 'leather_bloom', 'leather_floater', 'leather_smoothy_nappa', 'pu_leather'])} />
              <InputField label="Upholstery Color" name="upholstery_color" placeholder="e.g. Beige, Charcoal Grey" />
              <ToggleGroupField name="polish_finish" label="Polish Finish" value={toggleValues.polish_finish} onValueChange={(v) => handleToggleChange('polish_finish', v)} disabled={false} options={createOptions(['matt_finish', 'glossy_finish'])} />
              <InputField label="Polish Color" name="polish_color" placeholder="e.g. Walnut, Teak" />
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
