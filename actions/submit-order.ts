// app/actions/orderActions.ts
'use server'; // This directive is crucial for making this a Server Action

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'; // Adjust path if necessary

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
  const supabase = createClient();
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

            const { error: orderItemError } = await supabase.from('order_items').insert({
                order_id: orderId,
                product_type: productType,
                sofa_product_id: productType === 'sofa' ? productId : null,
                bed_product_id: productType === 'bed' ? productId : null,
                quantity: quantity || 1,
                due_date: dueDate,
            });
            if (orderItemError) throw new Error(`[Item ${i+1}] Failed to add existing product to order: ${orderItemError.message}`);

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
            const referenceImageFile = formData.get(`${baseName}.reference_image_url`) as File | null;
            let reference_image_url: string | undefined = undefined;
            if (referenceImageFile && referenceImageFile.size > 0) {
                const filePath = `public/orders/${orderId}/${baseName}-ref-${referenceImageFile.name}`;
                const { error } = await supabase.storage.from('product-images').upload(filePath, referenceImageFile);
                if (error) throw new Error(`[Item ${i+1}] Failed to upload reference image: ${error.message}`);
                reference_image_url = supabase.storage.from('product-images').getPublicUrl(filePath).data.publicUrl;
            }

            const measurementDrawingFile = formData.get(`${baseName}.measurement_drawing_url`) as File | null;
            let measurement_drawing_url: string | undefined = undefined;
            if (measurementDrawingFile && measurementDrawingFile.size > 0) {
                const filePath = `public/orders/${orderId}/${baseName}-measure-${measurementDrawingFile.name}`;
                const { error } = await supabase.storage.from('product-images').upload(filePath, measurementDrawingFile);
                if (error) throw new Error(`[Item ${i+1}] Failed to upload measurement drawing: ${error.message}`);
                measurement_drawing_url = supabase.storage.from('product-images').getPublicUrl(filePath).data.publicUrl;
            }
            
            let newProductId: string;

            if (productType === 'sofa') {
                const { data: newSofa, error } = await supabase.from('sofa_products').insert({
                    customization: isCustomization,
                    model_name,
                    model_family_configuration: formData.get(`${baseName}.model_family_configuration`) as string | undefined,
                    "2_seater_length": Number(formData.get(`${baseName}.2_seater_length`)) || null,
                    "1_seater_length": Number(formData.get(`${baseName}.1_seater_length`)) || null,
                    reference_image_url,
                    measurement_drawing_url,
                    description: formData.get(`${baseName}.description`) as string | undefined,
                    recliner_mechanism_mode: formData.get(`${baseName}.recliner_mechanism_mode`) as string | undefined,
                    recliner_mechanism_flip: formData.get(`${baseName}.recliner_mechanism_flip`) as string | undefined,
                    wood_to_floor: formData.get(`${baseName}.wood_to_floor`) === 'true',
                    headrest_mode: formData.get(`${baseName}.headrest_mode`) as string | undefined,
                    cup_holder: formData.get(`${baseName}.cup_holder`) as string | undefined,
                    snack_swivel_tray: formData.get(`${baseName}.snack_swivel_tray`) === 'true',
                    daybed_headrest_mode: formData.get(`${baseName}.daybed_headrest_mode`) as string | undefined,
                    daybed_position: formData.get(`${baseName}.daybed_position`) as string | undefined,
                    armrest_storage: formData.get(`${baseName}.armrest_storage`) === 'true',
                    storage_side: formData.get(`${baseName}.storage_side`) as string | undefined,
                    foam_density_seating: Number(formData.get(`${baseName}.foam_density_seating`)),
                    foam_density_backrest: Number(formData.get(`${baseName}.foam_density_backrest`)),
                    belt_details: formData.get(`${baseName}.belt_details`) as string | undefined,
                    leg_type: formData.get(`${baseName}.leg_type`) as string | undefined,
                    pvd_color: formData.get(`${baseName}.pvd_color`) as string | undefined,
                    chester_option: formData.get(`${baseName}.chester_option`) as string | undefined,
                    armrest_panels: formData.get(`${baseName}.armrest_panels`) as string | undefined,
                    polish_color: formData.get(`${baseName}.polish_color`) as string | undefined,
                    polish_finish: formData.get(`${baseName}.polish_finish`) as string | undefined,
                    upholstery: formData.get(`${baseName}.upholstery`) as string | undefined,
                    upholstery_color: formData.get(`${baseName}.upholstery_color`) as string | undefined,
                    total_width: Number(formData.get(`${baseName}.total_width`)),
                    total_depth: Number(formData.get(`${baseName}.total_depth`)),
                    total_height: Number(formData.get(`${baseName}.total_height`)),
                    seat_width: Number(formData.get(`${baseName}.seat_width`)),
                    seat_depth: Number(formData.get(`${baseName}.seat_depth`)),
                    seat_height: Number(formData.get(`${baseName}.seat_height`)),
                    armrest_width: Number(formData.get(`${baseName}.armrest_width`)),
                    armrest_depth: Number(formData.get(`${baseName}.armrest_depth`)),
                    purchase_count: 1, // Set purchase count to 1 for new products
                }).select('id').single();
                if (error) throw new Error(`[Item ${i+1}] Failed to create new sofa product: ${error.message}`);
                newProductId = newSofa.id;
            } else { // productType === 'bed'
                 const { data: newBed, error } = await supabase.from('bed_products').insert({
                    customization: isCustomization,
                    model_name,
                    reference_image_url,
                    measurement_drawing_url,
                    description: formData.get(`${baseName}.description`) as string | undefined,
                    bed_size: formData.get(`${baseName}.bed_size`) as string | undefined,
                    customized_mattress_size: formData.get(`${baseName}.customized_mattress_size`) as string | undefined,
                    headboard_type: formData.get(`${baseName}.headboard_type`) as string | undefined,
                    storage_option: formData.get(`${baseName}.storage_option`) as string | undefined,
                    bed_portion: formData.get(`${baseName}.bed_portion`) as string | undefined,
                    upholstery: formData.get(`${baseName}.upholstery`) as string | undefined,
                    upholstery_color: formData.get(`${baseName}.upholstery_color`) as string | undefined,
                    polish_color: formData.get(`${baseName}.polish_color`) as string | undefined,
                    polish_finish: formData.get(`${baseName}.polish_finish`) as string | undefined,
                    total_width: Number(formData.get(`${baseName}.total_width`)),
                    total_depth: Number(formData.get(`${baseName}.total_depth`)),
                    total_height: Number(formData.get(`${baseName}.total_height`)),
                    purchase_count: 1, // Set purchase count to 1 for new products
                }).select('id').single();
                if (error) throw new Error(`[Item ${i+1}] Failed to create new bed product: ${error.message}`);
                newProductId = newBed.id;
            }

            // --- Link the newly created product to the order ---
            const { error: orderItemError } = await supabase.from('order_items').insert({
              order_id: orderId,
              product_type: productType,
              sofa_product_id: productType === 'sofa' ? newProductId : null,
              bed_product_id: productType === 'bed' ? newProductId : null,
              quantity: quantity || 1,
              due_date: dueDate,
            });
            if (orderItemError) throw new Error(`[Item ${i+1}] Failed to link new ${productType} to order: ${orderItemError.message}`);
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
