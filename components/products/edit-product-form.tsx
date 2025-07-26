// components/products/edit-product-form.tsx
'use client';

import { useState, useTransition } from 'react';
import { Product } from '@/types/products';
import { updateProductAction } from '@/actions/update-product';
import { InputField, ToggleGroupField, ToggleOption } from '@/components/products/fields';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // You may need to create/import this simple component
import { toast } from 'sonner';

// Helper to create options for ToggleGroupField from an array of values
const createToggleOptions = <T extends string | boolean>(options: T[], labels?: string[]): ToggleOption<T>[] => {
  return options.map((opt, index) => ({
    value: opt,
    label: labels ? labels[index] : String(opt).charAt(0).toUpperCase() + String(opt).slice(1).replace(/_/g, ' '),
  }));
};

// --- Options based on your SQL Schema ---
const booleanOptions = createToggleOptions([true, false], ['Yes', 'No']);
const polishFinishOptions = createToggleOptions(['matt_finish', 'glossy_finish']);
const upholsteryOptions = createToggleOptions(['fabric', 'pu', 'pu_leather', 'leather_bloom', 'leather_floater', 'leather_floater_max', 'leather_platinum_max', 'leather_european_nappa', 'leather_smoothy_nappa']);

// Bed Specific Options
const bedSizeOptions = createToggleOptions(['king', 'queen', 'customized']);
const headboardTypeOptions = createToggleOptions(['medium_back_4ft', 'high_back_4_5ft']);
const storageOptions = createToggleOptions(['hydraulic', 'channel', 'motorised', 'without_storage']);

// Sofa Specific Options
const reclinerMechanismModeOptions = createToggleOptions(['manual', 'motorized_single', 'motorized_double']);
const reclinerMechanismFlipOptions = createToggleOptions(['single_flip', 'double_flip', 'double_motor_with_headrest']);
const headrestModeOptions = createToggleOptions(['manual', 'motorized']);
const cupHolderOptions = createToggleOptions(['normal_push_back', 'chiller_cup']);
const daybedPositionOptions = createToggleOptions(['rhs', 'lhs']);
const storageSideOptions = createToggleOptions(['rhs_arm', 'lhs_arm', 'both_arm']);
const beltDetailsOptions = createToggleOptions(['elastic_belt', 'zig_zag_spring', 'pocket_spring']);
const legTypeOptions = createToggleOptions(['wood', 'pvd', 'ss']);
const chesterOptions = createToggleOptions(['with_button', 'without_button']);
const bedPortionOptions = createToggleOptions(['single', 'double']);

// --- Component Definition ---
interface EditProductFormProps {
  product: Product;
  productType: 'sofa' | 'bed';
  onFormSubmit: () => void;
}

export default function EditProductForm({ product, productType, onFormSubmit }: EditProductFormProps) {
  const [isPending, startTransition] = useTransition();
  // State to manage all controlled components
  const [formState, setFormState] = useState<Product>(product);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Handle empty string for number inputs as null, otherwise parse it
    const finalValue = type === 'number' ? (value === '' ? null : parseFloat(value)) : value;
    setFormState(prevState => ({
      ...prevState,
      [name]: finalValue,
    }));
  };

  const handleToggleChange = (name: keyof Product, value: string | boolean | number | null) => {
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  // Client-side wrapper for the server action to handle pending state and response
  const clientAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProductAction(formData);
      if (result.success) {
        toast.success(result.message); // Or use a toast notification
        onFormSubmit(); // Close modal on success
      } else {
        toast.error(`Error: ${result.message}`);
      }
    });
  };

  return (
    <form action={clientAction} className="space-y-4">
      {/* Hidden fields to identify the product and its type for the server action */}
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="product_type" value={productType} />

      {/* --- General Information Section --- */}
      <h3 className="text-lg font-medium border-b pb-2">General Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <InputField name="model_name" label="Model Name" value={formState.model_name || ''} onChange={handleInputChange} placeholder="e.g., Elegance Sofa"/>
        <div>
          <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</Label>
          <Textarea id="description" name="description" value={formState.description || ''} onChange={handleInputChange} placeholder="A brief description of the product" className="h-24"/>
        </div>
        <InputField name="reference_image_url" label="Reference Image URL" value={formState.reference_image_url || ''} onChange={handleInputChange} placeholder="https://example.com/image.jpg"/>
        <InputField name="measurement_drawing_url" label="Measurement Drawing URL" value={formState.measurement_drawing_url || ''} onChange={handleInputChange} placeholder="https://example.com/drawing.jpg"/>
      </div>
      
      {/* --- Bed Specific Fields --- */}
      {productType === 'bed' && (
        <>
          <h3 className="text-lg font-medium border-b pb-2 pt-4">Bed Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <ToggleGroupField label="Bed Size" name="bed_size" options={bedSizeOptions} value={formState.bed_size} onValueChange={(v) => handleToggleChange('bed_size', v)} disabled={isPending}/>
            {formState.bed_size === 'customized' && (
              <InputField name="customized_mattress_size" label="Custom Mattress Size" value={formState.customized_mattress_size || ''} onChange={handleInputChange} placeholder="e.g., 75x70 inches"/>
            )}
            <ToggleGroupField label="Headboard Type" name="headboard_type" options={headboardTypeOptions} value={formState.headboard_type} onValueChange={(v) => handleToggleChange('headboard_type', v)} disabled={isPending}/>
            <ToggleGroupField label="Storage Option" name="storage_option" options={storageOptions} value={formState.storage_option} onValueChange={(v) => handleToggleChange('storage_option', v)} disabled={isPending}/>
            <ToggleGroupField label="Bed Portion" name="bed_portion" options={bedPortionOptions} value={formState.bed_portion} onValueChange={(v) => handleToggleChange('bed_portion', v)} disabled={isPending}/>
          </div>
          <h3 className="text-lg font-medium border-b pb-2 pt-4">Bed Dimensions (in inches)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <InputField name="total_width" label="Total Width" type="number" step="0.1" value={formState.total_width ?? ''} onChange={handleInputChange} />
            <InputField name="total_depth" label="Total Depth" type="number" step="0.1" value={formState.total_depth ?? ''} onChange={handleInputChange} />
            <InputField name="total_height" label="Total Height" type="number" step="0.1" value={formState.total_height ?? ''} onChange={handleInputChange} />
          </div>
        </>
      )}

      {/* --- Sofa Specific Fields --- */}
      {productType === 'sofa' && (
         <>
          <h3 className="text-lg font-medium border-b pb-2 pt-4">Sofa Configuration</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <ToggleGroupField label="Model Family Configuration" name="model_family_configuration" options={createToggleOptions(['1 str', '2 str', '3 str', '3+2 str', '3+ daybed', '2+daybed', '3+cnr+3', '3+cnr+2', '2+cnr+2', '3+cnr+1', '2+cnr+1', '3+2+1'])} value={formState.model_family_configuration} onValueChange={(v) => handleToggleChange('model_family_configuration', v)} disabled={isPending} />
                {(formState.model_family_configuration === '3+2 str' || formState.model_family_configuration === '3+2+1') && (
                    <InputField name="2_seater_length" label="2 Seater Length (in.)" type="number" step="0.01" value={formState['2_seater_length'] ?? ''} onChange={handleInputChange} />
                )}
                {formState.model_family_configuration === '3+2+1' && (
                    <InputField name="1_seater_length" label="1 Seater Length (in.)" type="number" step="0.01" value={formState['1_seater_length'] ?? ''} onChange={handleInputChange} />
                )}
              <ToggleGroupField label="Recliner Mechanism" name="recliner_mechanism_mode" options={reclinerMechanismModeOptions} value={formState.recliner_mechanism_mode} onValueChange={(v) => handleToggleChange('recliner_mechanism_mode', v)} disabled={isPending} />
              <ToggleGroupField label="Recliner Flip" name="recliner_mechanism_flip" options={reclinerMechanismFlipOptions} value={formState.recliner_mechanism_flip} onValueChange={(v) => handleToggleChange('recliner_mechanism_flip', v)} disabled={isPending} />
              <ToggleGroupField label="Headrest Mode" name="headrest_mode" options={headrestModeOptions} value={formState.headrest_mode} onValueChange={(v) => handleToggleChange('headrest_mode', v)} disabled={isPending} />
              <ToggleGroupField label="Daybed Headrest" name="daybed_headrest_mode" options={headrestModeOptions} value={formState.daybed_headrest_mode} onValueChange={(v) => handleToggleChange('daybed_headrest_mode', v)} disabled={isPending} />
              <ToggleGroupField label="Cup Holder" name="cup_holder" options={cupHolderOptions} value={formState.cup_holder} onValueChange={(v) => handleToggleChange('cup_holder', v)} disabled={isPending} />
              <ToggleGroupField label="Snack Swivel Tray" name="snack_swivel_tray" options={booleanOptions} value={formState.snack_swivel_tray} onValueChange={(v) => handleToggleChange('snack_swivel_tray', v)} disabled={isPending} />
              <ToggleGroupField label="Daybed Position" name="daybed_position" options={daybedPositionOptions} value={formState.daybed_position} onValueChange={(v) => handleToggleChange('daybed_position', v)} disabled={isPending} />
              <ToggleGroupField label="Armrest Storage" name="armrest_storage" options={booleanOptions} value={formState.armrest_storage} onValueChange={(v) => handleToggleChange('armrest_storage', v)} disabled={isPending} />
              <ToggleGroupField label="Storage Side" name="storage_side" options={storageSideOptions} value={formState.storage_side} onValueChange={(v) => handleToggleChange('storage_side', v)} disabled={isPending} />
              <ToggleGroupField label="Belt Details" name="belt_details" options={beltDetailsOptions} value={formState.belt_details} onValueChange={(v) => handleToggleChange('belt_details', v)} disabled={isPending} />
              <ToggleGroupField label="Leg Type" name="leg_type" options={legTypeOptions} value={formState.leg_type} onValueChange={(v) => handleToggleChange('leg_type', v)} disabled={isPending} />
              {formState.leg_type === 'pvd' && (<InputField name="pvd_color" label="PVD Color" value={formState.pvd_color || ''} onChange={handleInputChange} placeholder="e.g., Gold, Rose Gold"/> )}
              <ToggleGroupField label="Chester Option" name="chester_option" options={chesterOptions} value={formState.chester_option} onValueChange={(v) => handleToggleChange('chester_option', v)} disabled={isPending} />
              <InputField name="armrest_panels" label="Armrest Panels" value={formState.armrest_panels || ''} onChange={handleInputChange} placeholder="e.g., Tufting, Fluting"/>
              <ToggleGroupField label="Wood to Floor" name="wood_to_floor" options={booleanOptions} value={formState.wood_to_floor} onValueChange={(v) => handleToggleChange('wood_to_floor', v)} disabled={isPending} />
              <InputField name="foam_density_seating" label="Foam Density (Seating)" type="number" step="0.1" value={formState.foam_density_seating ?? ''} onChange={handleInputChange} placeholder="e.g., 40.5" />
              <InputField name="foam_density_backrest" label="Foam Density (Backrest)" type="number" step="0.1" value={formState.foam_density_backrest ?? ''} onChange={handleInputChange} placeholder="e.g., 32.0" />
           </div>
           <h3 className="text-lg font-medium border-b pb-2 pt-4">Sofa Dimensions (in inches)</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <InputField name="total_width" label="Total Width" type="number" step="0.1" value={formState.total_width ?? ''} onChange={handleInputChange} />
              <InputField name="total_depth" label="Total Depth" type="number" step="0.1" value={formState.total_depth ?? ''} onChange={handleInputChange} />
              <InputField name="total_height" label="Total Height" type="number" step="0.1" value={formState.total_height ?? ''} onChange={handleInputChange} />
              <InputField name="seat_height" label="Seat Height" type="number" step="0.1" value={formState.seat_height ?? ''} onChange={handleInputChange} />
              <InputField name="seat_width" label="Seat Width" type="number" step="0.1" value={formState.seat_width ?? ''} onChange={handleInputChange} />
              <InputField name="seat_depth" label="Seat Depth" type="number" step="0.1" value={formState.seat_depth ?? ''} onChange={handleInputChange} />
              <InputField name="armrest_width" label="Armrest Width" type="number" step="0.1" value={formState.armrest_width ?? ''} onChange={handleInputChange} />
              <InputField name="armrest_depth" label="Armrest Depth" type="number" step="0.1" value={formState.armrest_depth ?? ''} onChange={handleInputChange} />
           </div>
         </>
      )}

      {/* --- Upholstery & Finish Section (Common to both) --- */}
      <h3 className="text-lg font-medium border-b pb-2 pt-4">Upholstery & Finish</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <ToggleGroupField label="Upholstery Material" name="upholstery" options={upholsteryOptions} value={formState.upholstery} onValueChange={(v) => handleToggleChange('upholstery', v)} disabled={isPending}/>
        <InputField name="upholstery_color" label="Upholstery Color" value={formState.upholstery_color || ''} onChange={handleInputChange} placeholder="e.g., Charcoal Grey"/>
        <InputField name="polish_color" label="Polish Color" value={formState.polish_color || ''} onChange={handleInputChange} placeholder="e.g., Walnut, Teak"/>
        <ToggleGroupField label="Polish Finish" name="polish_finish" options={polishFinishOptions} value={formState.polish_finish} onValueChange={(v) => handleToggleChange('polish_finish', v)} disabled={isPending}/>
      </div>

      {/* --- Form Action Buttons --- */}
      <div className="flex justify-end gap-2 pt-4 border-t mt-6">
        <Button type="button" variant="outline" onClick={onFormSubmit} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
