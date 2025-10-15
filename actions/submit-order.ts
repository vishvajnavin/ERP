// app/actions/orderActions.ts
'use server'; // This directive is crucial for making this a Server Action

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'; // Adjust path if necessary

// Helper to convert empty strings or the string "null" to actual null
const getFormDataValueOrNull = (formData: FormData, key: string) => {
    const value = formData.get(key);
    if (value === '' || value === 'null') {
        return null;
    }
    return value;
};

// Helper to convert empty strings, "null", or invalid numbers to actual null
const getNumberOrNull = (formData: FormData, key: string) => {
    const value = getFormDataValueOrNull(formData, key);
    if (value === null) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
};

export interface ProductItem {
  is_existing_model: boolean;
  is_customization?: boolean;
  product_type: 'sofa' | 'bed';
  quantity?: number;
  // Existing model properties
  sofa_product_id?: string;
  bed_product_id?: string;
  // New model properties (common)
  model_name?: string;
  description?: string;
  reference_image_url?: string;
  measurement_drawing_url?: string;
  // New sofa-specific properties
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
  foam_density_seating?: string;
  foam_density_backrest?: string;
  belt_details?: string;
  leg_type?: string;
  pvd_color?: string;
  chester_option?: string;
  armrest_panels?: string;
  polish_color?: string;
  polish_finish?: string;
  seat_width?: number;
  seat_depth?: number;
  seat_height?: number;
  armrest_width?: number;
  armrest_depth?: number;
  upholstery?: string;
  upholstery_color?: string;
  total_width?: number;
  total_depth?: number;
  total_height?: number;
  // New bed-specific properties
  headboard_type?: string;
  storage_option?: string;
  bed_portion?: string;
  bed_size?: string;
  customized_mattress_size?: string;
}

interface FormState {
  success: boolean;
  message: string | null;
}

export async function submitOrder(prevState: FormState, formData: FormData) {
  const supabase = await createClient();
  const selectedCustomerId = formData.get('selectedCustomerId') as string;
  const totalProducts = parseInt(formData.get('totalProducts') as string, 10);

  if (!selectedCustomerId || isNaN(totalProducts) || totalProducts < 1) {
    return { success: false, message: 'Invalid customer or product count.' };
  }

  try {
    const products = [];

    // 1. Process each product item from the form
    for (let i = 0; i < totalProducts; i++) {
      const baseName = `products[${i}]`;
      const product: any = {
        product_type: formData.get(`${baseName}.product_type`),
        is_existing_model: formData.get(`${baseName}.is_existing_model`) === 'true',
        is_customization: formData.get(`${baseName}.is_customization`) === 'true',
        quantity: parseInt(formData.get(`${baseName}.quantity`) as string, 10) || 1,
        due_date: formData.get(`${baseName}.due_date`) || null,
      };

      // --- Handle File Uploads ---
      const referenceImageValue = formData.get(`${baseName}.reference_image_url`);
      if (referenceImageValue instanceof File && referenceImageValue.size > 0) {
        const fileExtension = referenceImageValue.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        const filePath = `reference/${fileName}`;
        const { data, error } = await supabase.storage.from('order-images').upload(filePath, referenceImageValue);
        if (error) throw new Error(`[Item ${i + 1}] Failed to upload reference image: ${error.message}`);
        product.reference_image_url = data.path;
      } else if (typeof referenceImageValue === 'string') {
        product.reference_image_url = referenceImageValue;
      }

      const measurementDrawingValue = formData.get(`${baseName}.measurement_drawing_url`);
      if (measurementDrawingValue instanceof File && measurementDrawingValue.size > 0) {
        const fileExtension = measurementDrawingValue.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        const filePath = `measurement/${fileName}`;
        const { data, error } = await supabase.storage.from('order-images').upload(filePath, measurementDrawingValue);
        if (error) throw new Error(`[Item ${i + 1}] Failed to upload measurement drawing: ${error.message}`);
        product.measurement_drawing_url = data.path;
      } else if (typeof measurementDrawingValue === 'string') {
        product.measurement_drawing_url = measurementDrawingValue;
      }

      // --- Populate product details from form ---
      if (product.is_existing_model && !product.is_customization) {
        product.sofa_product_id = getFormDataValueOrNull(formData, `${baseName}.sofa_product_id`);
        product.bed_product_id = getFormDataValueOrNull(formData, `${baseName}.bed_product_id`);
      } else {
        product.model_name = getFormDataValueOrNull(formData, `${baseName}.model_name`);
        product.description = getFormDataValueOrNull(formData, `${baseName}.description`);
        
        if (product.product_type === 'sofa') {
            product.model_family_configuration = getFormDataValueOrNull(formData, `${baseName}.model_family_configuration`);
            product["2_seater_length"] = getNumberOrNull(formData, `${baseName}.2_seater_length`);
            product["1_seater_length"] = getNumberOrNull(formData, `${baseName}.1_seater_length`);
            product.recliner_mechanism_mode = getFormDataValueOrNull(formData, `${baseName}.recliner_mechanism_mode`);
            product.recliner_mechanism_flip = getFormDataValueOrNull(formData, `${baseName}.recliner_mechanism_flip`);
            product.wood_to_floor = getFormDataValueOrNull(formData, `${baseName}.wood_to_floor`) === 'true' ? true : (getFormDataValueOrNull(formData, `${baseName}.wood_to_floor`) === 'false' ? false : null);
            product.headrest_mode = getFormDataValueOrNull(formData, `${baseName}.headrest_mode`);
            product.cup_holder = getFormDataValueOrNull(formData, `${baseName}.cup_holder`);
            product.snack_swivel_tray = formData.get(`${baseName}.snack_swivel_tray`) === 'true';
            product.daybed_headrest_mode = getFormDataValueOrNull(formData, `${baseName}.daybed_headrest_mode`);
            product.daybed_position = getFormDataValueOrNull(formData, `${baseName}.daybed_position`);
            product.armrest_storage = formData.get(`${baseName}.armrest_storage`) === 'true';
            product.storage_side = getFormDataValueOrNull(formData, `${baseName}.storage_side`);
            product.foam_density_seating = getNumberOrNull(formData, `${baseName}.foam_density_seating`);
            product.foam_density_backrest = getNumberOrNull(formData, `${baseName}.foam_density_backrest`);
            product.belt_details = getFormDataValueOrNull(formData, `${baseName}.belt_details`);
            product.leg_type = getFormDataValueOrNull(formData, `${baseName}.leg_type`);
            product.pvd_color = getFormDataValueOrNull(formData, `${baseName}.pvd_color`);
            product.chester_option = getFormDataValueOrNull(formData, `${baseName}.chester_option`);
            product.armrest_panels = getFormDataValueOrNull(formData, `${baseName}.armrest_panels`);
            product.polish_color = getFormDataValueOrNull(formData, `${baseName}.polish_color`);
            product.polish_finish = getFormDataValueOrNull(formData, `${baseName}.polish_finish`);
            product.upholstery = getFormDataValueOrNull(formData, `${baseName}.upholstery`);
            product.upholstery_color = getFormDataValueOrNull(formData, `${baseName}.upholstery_color`);
            product.total_width = getNumberOrNull(formData, `${baseName}.total_width`);
            product.total_depth = getNumberOrNull(formData, `${baseName}.total_depth`);
            product.total_height = getNumberOrNull(formData, `${baseName}.total_height`);
            product.seat_width = getNumberOrNull(formData, `${baseName}.seat_width`);
            product.seat_depth = getNumberOrNull(formData, `${baseName}.seat_depth`);
            product.seat_height = getNumberOrNull(formData, `${baseName}.seat_height`);
            product.armrest_width = getNumberOrNull(formData, `${baseName}.armrest_width`);
            product.armrest_depth = getNumberOrNull(formData, `${baseName}.armrest_depth`);
        } else { // bed
            product.bed_size = getFormDataValueOrNull(formData, `${baseName}.bed_size`);
            product.customized_mattress_size = getFormDataValueOrNull(formData, `${baseName}.customized_mattress_size`);
            product.headboard_type = getFormDataValueOrNull(formData, `${baseName}.headboard_type`);
            product.storage_option = getFormDataValueOrNull(formData, `${baseName}.storage_option`);
            product.bed_portion = getFormDataValueOrNull(formData, `${baseName}.bed_portion`);
            product.upholstery = getFormDataValueOrNull(formData, `${baseName}.upholstery`);
            product.upholstery_color = getFormDataValueOrNull(formData, `${baseName}.upholstery_color`);
            product.polish_color = getFormDataValueOrNull(formData, `${baseName}.polish_color`);
            product.polish_finish = getFormDataValueOrNull(formData, `${baseName}.polish_finish`);
            product.total_width = getNumberOrNull(formData, `${baseName}.total_width`);
            product.total_depth = getNumberOrNull(formData, `${baseName}.total_depth`);
            product.total_height = getNumberOrNull(formData, `${baseName}.total_height`);
        }
      }
      products.push(product);
    }

    // 2. Call the RPC function to submit the entire order
    const { data: orderId, error } = await supabase.rpc('submit_full_order', {
      p_customer_id: parseInt(selectedCustomerId, 10),
      p_products: products,
    });

    if (error) {
      throw new Error(`Failed to submit order via RPC: ${error.message}`);
    }

    // 3. Revalidate and return success
    revalidatePath(`/place-order`);
    return { success: true, message: `Order #${orderId} created successfully!` };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('Order submission error:', errorMessage);
    return { success: false, message: errorMessage };
  }
}
