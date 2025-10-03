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

  let orderId: string | null = null;

  try {
    // 1. Create the main order record to get an ID
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      customer_id: selectedCustomerId,
      total_products: totalProducts,
    }).select('id').single();

    if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);
    orderId = order.id;

    // 2. Process each product item from the form
    for (let i = 0; i < totalProducts; i++) {
        const baseName = `products[${i}]`;
        const productType = formData.get(`${baseName}.product_type`) as 'sofa' | 'bed';
        const isExistingModel = formData.get(`${baseName}.is_existing_model`) === 'true';
        const isCustomization = formData.get(`${baseName}.is_customization`) === 'true';
        const quantity = parseInt(formData.get(`${baseName}.quantity`) as string, 10);
        const dueDate = formData.get(`${baseName}.due_date`) as string || null;

        // --- Case 1: Existing, non-customized product ---
        if (isExistingModel && !isCustomization) {
            const productIdKey = productType === 'sofa' ? 'sofa_product_id' : 'bed_product_id';
            const productId = formData.get(`${baseName}.${productIdKey}`) as string;

            const { data: newOrderItem, error: orderItemError } = await supabase.from('order_items').insert({
                order_id: orderId,
                product_type: productType,
                sofa_product_id: productType === 'sofa' ? productId : null,
                bed_product_id: productType === 'bed' ? productId : null,
                quantity: quantity || 1,
                due_date: dueDate,
            })
            .select("id")
            .single();

            if (orderItemError) throw new Error(`[Item ${i+1}] Failed to add existing product to order: ${orderItemError.message}`);
            if (!newOrderItem)
              throw new Error(
                `[Item ${i + 1}] Failed to retrieve new order item ID.`
              );
            // --- NEW: Initialize QC Checklist for this order item ---
            const { error: qcError } = await supabase.rpc(
              "start_order_item_qc",
              {
                p_order_item_id: newOrderItem.id,
              }
            );
            if (qcError)
              throw new Error(
                `[Item ${i + 1}] Failed to initialize QC checklist: ${
                  qcError.message
                }`
              );
            // --- Increment purchase count for existing product ---
            const { error: rpcError } = await supabase.rpc('increment_purchase_count', {
                p_product_id: parseInt(productId, 10),
                p_product_type: productType,
            });
            if (rpcError) throw new Error(`[Item ${i+1}] Failed to increment purchase count: ${rpcError.message}`);
        
        // --- Case 2: customized product ---
        } else {
            const model_name = formData.get(`${baseName}.model_name`) as string;

            // --- Handle File Uploads ---
            const referenceImageValue = formData.get(`${baseName}.reference_image_url`);
            let reference_image_url: string | undefined = undefined;
            if (referenceImageValue instanceof File && referenceImageValue.size > 0) {
                const fileExtension = referenceImageValue.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExtension}`;
                const filePath = `reference/${fileName}`;
                const { data, error } = await supabase.storage.from('order-images').upload(filePath, referenceImageValue);
                if (error) throw new Error(`[Item ${i+1}] Failed to upload reference image: ${error.message}`);
                reference_image_url = data.path;
            } else if (typeof referenceImageValue === 'string') {
                reference_image_url = referenceImageValue;
            }

            const measurementDrawingValue = formData.get(`${baseName}.measurement_drawing_url`);
            let measurement_drawing_url: string | undefined = undefined;
            if (measurementDrawingValue instanceof File && measurementDrawingValue.size > 0) {
                const fileExtension = measurementDrawingValue.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExtension}`;
                const filePath = `measurement/${fileName}`;
                const { data, error } = await supabase.storage.from('order-images').upload(filePath, measurementDrawingValue);
                if (error) throw new Error(`[Item ${i+1}] Failed to upload measurement drawing: ${error.message}`);
                measurement_drawing_url = data.path;
            } else if (typeof measurementDrawingValue === 'string') {
                measurement_drawing_url = measurementDrawingValue;
            }
            
            let newProductId: string;

            if (productType === 'sofa') {
                const { data: newSofa, error } = await supabase.from('sofa_products').insert({
                    customization: isCustomization,
                    model_name,
                    model_family_configuration: getFormDataValueOrNull(formData, `${baseName}.model_family_configuration`),
                    "2_seater_length": getNumberOrNull(formData, `${baseName}.2_seater_length`),
                    "1_seater_length": getNumberOrNull(formData, `${baseName}.1_seater_length`),
                    reference_image_url,
                    measurement_drawing_url,
                    description: getFormDataValueOrNull(formData, `${baseName}.description`),
                    recliner_mechanism_mode: getFormDataValueOrNull(formData, `${baseName}.recliner_mechanism_mode`),
                    recliner_mechanism_flip: getFormDataValueOrNull(formData, `${baseName}.recliner_mechanism_flip`),
                    wood_to_floor: formData.get(`${baseName}.wood_to_floor`) === 'true',
                    headrest_mode: getFormDataValueOrNull(formData, `${baseName}.headrest_mode`),
                    cup_holder: getFormDataValueOrNull(formData, `${baseName}.cup_holder`),
                    snack_swivel_tray: formData.get(`${baseName}.snack_swivel_tray`) === 'true',
                    daybed_headrest_mode: getFormDataValueOrNull(formData, `${baseName}.daybed_headrest_mode`),
                    daybed_position: getFormDataValueOrNull(formData, `${baseName}.daybed_position`),
                    armrest_storage: formData.get(`${baseName}.armrest_storage`) === 'true',
                    storage_side: getFormDataValueOrNull(formData, `${baseName}.storage_side`),
                    foam_density_seating: getNumberOrNull(formData, `${baseName}.foam_density_seating`),
                    foam_density_backrest: getNumberOrNull(formData, `${baseName}.foam_density_backrest`),
                    belt_details: getFormDataValueOrNull(formData, `${baseName}.belt_details`),
                    leg_type: getFormDataValueOrNull(formData, `${baseName}.leg_type`),
                    pvd_color: getFormDataValueOrNull(formData, `${baseName}.pvd_color`),
                    chester_option: getFormDataValueOrNull(formData, `${baseName}.chester_option`),
                    armrest_panels: getFormDataValueOrNull(formData, `${baseName}.armrest_panels`),
                    polish_color: getFormDataValueOrNull(formData, `${baseName}.polish_color`),
                    polish_finish: getFormDataValueOrNull(formData, `${baseName}.polish_finish`),
                    upholstery: getFormDataValueOrNull(formData, `${baseName}.upholstery`),
                    upholstery_color: getFormDataValueOrNull(formData, `${baseName}.upholstery_color`),
                    total_width: getNumberOrNull(formData, `${baseName}.total_width`),
                    total_depth: getNumberOrNull(formData, `${baseName}.total_depth`),
                    total_height: getNumberOrNull(formData, `${baseName}.total_height`),
                    seat_width: getNumberOrNull(formData, `${baseName}.seat_width`),
                    seat_depth: getNumberOrNull(formData, `${baseName}.seat_depth`),
                    seat_height: getNumberOrNull(formData, `${baseName}.seat_height`),
                    armrest_width: getNumberOrNull(formData, `${baseName}.armrest_width`),
                    armrest_depth: getNumberOrNull(formData, `${baseName}.armrest_depth`),
                    purchase_count: 1, // Set purchase count to 1 for new products
                }).select().single();
                if (error) throw new Error(`[Item ${i+1}] Failed to create new sofa product: ${error.message}`);
                newProductId = newSofa.id;
            } else { // productType === 'bed'
                 const { data: newBed, error } = await supabase.from('bed_products').insert({
                    customization: isCustomization,
                    model_name,
                    reference_image_url,
                    measurement_drawing_url,
                    description: getFormDataValueOrNull(formData, `${baseName}.description`),
                    bed_size: getFormDataValueOrNull(formData, `${baseName}.bed_size`),
                    customized_mattress_size: getFormDataValueOrNull(formData, `${baseName}.customized_mattress_size`),
                    headboard_type: getFormDataValueOrNull(formData, `${baseName}.headboard_type`),
                    storage_option: getFormDataValueOrNull(formData, `${baseName}.storage_option`),
                    bed_portion: getFormDataValueOrNull(formData, `${baseName}.bed_portion`),
                    upholstery: getFormDataValueOrNull(formData, `${baseName}.upholstery`),
                    upholstery_color: getFormDataValueOrNull(formData, `${baseName}.upholstery_color`),
                    polish_color: getFormDataValueOrNull(formData, `${baseName}.polish_color`),
                    polish_finish: getFormDataValueOrNull(formData, `${baseName}.polish_finish`),
                    total_width: getNumberOrNull(formData, `${baseName}.total_width`),
                    total_depth: getNumberOrNull(formData, `${baseName}.total_depth`),
                    total_height: getNumberOrNull(formData, `${baseName}.total_height`),
                    purchase_count: 1, // Set purchase count to 1 for new products
                }).select('id').single();
                if (error) throw new Error(`[Item ${i+1}] Failed to create new bed product: ${error.message}`);
                newProductId = newBed.id;
            }

            // --- Link the newly created product to the order ---
            const { data:newOrderItem, error: orderItemError } = await supabase.from('order_items').insert({
              order_id: orderId,
              product_type: productType,
              sofa_product_id: productType === 'sofa' ? newProductId : null,
              bed_product_id: productType === 'bed' ? newProductId : null,
              quantity: quantity || 1,
              due_date: dueDate,
            })
            .select("id")
            .single();

            if (orderItemError) throw new Error(`[Item ${i+1}] Failed to link new ${productType} to order: ${orderItemError.message}`);

            if (!newOrderItem)
              throw new Error(
                `[Item ${i + 1}] Failed to retrieve new order item ID.`
              );
            console.log(newOrderItem)

            // --- NEW: Initialize QC Checklist for this new product order item ---
            const { error: qcError } = await supabase.rpc(
              "start_order_item_qc",
              {
                p_order_item_id: newOrderItem.id,
              }
            );
            if (qcError)
              throw new Error(
                `[Item ${i + 1}] Failed to initialize QC checklist: ${
                  qcError.message
                }`
              );
        }
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    console.error('Order submission error:', errorMessage);
    
    // Attempt to clean up the created order if an error occurs mid-process
    if (orderId) {
        await supabase.from('orders').delete().match({ id: orderId });
    }

    return { success: false, message: errorMessage };
  }

  // If we reach here, it means the try block completed successfully.
  // Now we can safely revalidate and redirect.
  revalidatePath(`/place-order`); // Invalidate cache for the order detail page
  //redirect(`/view-orders?order_id=${orderId}`); // Redirect to the new order's detail page
  return { success: true, message: `Order #${orderId} created successfully!` };
}
