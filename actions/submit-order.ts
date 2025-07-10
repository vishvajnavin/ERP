// app/actions/orderActions.ts
'use server'; // This directive is crucial for making this a Server Action

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
  recliner_mechanism_flip?: boolean;
  wood_to_floor?: boolean;
  headrest_mode?: string;
  cup_holder?: boolean;
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

interface SubmitOrderParams {
  selectedCustomer: string;
  totalProducts: number;
  products: ProductItem[];
}

export async function submitOrder(params: SubmitOrderParams) {
  const { selectedCustomer, totalProducts, products } = params;
  const supabase = createClient();

  if (!selectedCustomer || totalProducts < 1) {
    return { success: false, message: 'Invalid customer or product count.' };
  }

  try {
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      customer_id: selectedCustomer,
      total_products: totalProducts,
    }).select().single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return { success: false, message: `Failed to create order: ${orderError.message}` };
    }

    console.log('Order created:', order);

    for (const item of products) {
      if (item.is_existing_model && !item.is_customization) {
        const { error: orderItemError } = await supabase.from('order_items').insert({
          order_id: order.id,
          product_type: item.product_type,
          sofa_product_id: item.product_type === 'sofa' ? item.sofa_product_id : null,
          bed_product_id: item.product_type === 'bed' ? item.bed_product_id : null,
          quantity: item.quantity || 1,
        });
        if (orderItemError) {
          console.error(`Error inserting existing order item for ${item.product_type}:`, orderItemError);
          // You might want to handle this error more robustly,
          // e.g., by rolling back the order or notifying the user.
          return { success: false, message: `Failed to add existing product to order: ${orderItemError.message}` };
        }
      } else {
        if (item.product_type === 'sofa') {
          const { data: newSofa, error: newSofaError } = await supabase.from('sofa_products').insert({
            model_name: item.model_name,
            reference_image_url: item.reference_image_url,
            measurement_drawing_url: item.measurement_drawing_url,
            recliner_mechanism_mode: item.recliner_mechanism_mode,
            recliner_mechanism_flip: item.recliner_mechanism_flip,
            wood_to_floor: item.wood_to_floor,
            headrest_mode: item.headrest_mode,
            cup_holder: item.cup_holder,
            snack_swivel_tray: item.snack_swivel_tray,
            daybed_headrest_mode: item.daybed_headrest_mode,
            daybed_position: item.daybed_position,
            armrest_storage: item.armrest_storage,
            storage_side: item.storage_side,
            foam_density_seating: item.foam_density_seating,
            foam_density_backrest: item.foam_density_backrest,
            belt_details: item.belt_details,
            leg_type: item.leg_type,
            pvd_color: item.pvd_color,
            chester_option: item.chester_option,
            armrest_panels: item.armrest_panels,
            polish_color: item.polish_color,
            polish_finish: item.polish_finish,
            seat_width: item.seat_width,
            seat_depth: item.seat_depth,
            seat_height: item.seat_height,
            armrest_width: item.armrest_width,
            armrest_depth: item.armrest_depth,
            upholstery: item.upholstery,
            upholstery_color: item.upholstery_color,
            description: item.description,
            total_width: item.total_width,
            total_depth: item.total_depth,
            total_height: item.total_height,
          }).select().single();

          if (newSofaError) {
            console.error('Error creating new sofa product:', newSofaError);
            return { success: false, message: `Failed to create new sofa: ${newSofaError.message}` };
          }

          if (newSofa) {
            const { error: orderItemError } = await supabase.from('order_items').insert({
              order_id: order.id,
              product_type: 'sofa',
              sofa_product_id: newSofa.id,
              quantity: item.quantity || 1,
            });
            if (orderItemError) {
              console.error('Error inserting new sofa order item:', orderItemError);
              return { success: false, message: `Failed to add new sofa to order: ${orderItemError.message}` };
            }
          }
        } else if (item.product_type === 'bed') {
          const { data: newBed, error: newBedError } = await supabase.from('bed_products').insert({
            model_name: item.model_name,
            description: item.description,
            reference_image_url: item.reference_image_url,
            measurement_drawing_url: item.measurement_drawing_url,
            headboard_type: item.headboard_type,
            storage_option: item.storage_option,
            bed_portion: item.bed_portion,
            upholstery: item.upholstery,
            upholstery_color: item.upholstery_color,
            polish_color: item.polish_color,
            polish_finish: item.polish_finish,
            bed_size: item.bed_size,
            customized_mattress_size: item.customized_mattress_size,
            total_width: item.total_width,
            total_depth: item.total_depth,
            total_height: item.total_height,
          }).select().single();

          if (newBedError) {
            console.error('Error creating new bed product:', newBedError);
            return { success: false, message: `Failed to create new bed: ${newBedError.message}` };
          }

          if (newBed) {
            const { error: orderItemError } = await supabase.from('order_items').insert({
              order_id: order.id,
              product_type: 'bed',
              bed_product_id: newBed.id,
              quantity: item.quantity || 1,
            });
            if (orderItemError) {
              console.error('Error inserting new bed order item:', orderItemError);
              return { success: false, message: `Failed to add new bed to order: ${orderItemError.message}` };
            }
          }
        }
      }
    }

    return { success: true, message: 'Order placed successfully!' };

  } catch (error: unknown) {
    console.error('Unhandled error during order submission:', error);
    let errorMessage = 'Unknown error';
    if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      errorMessage = (error as { message: string }).message;
    }
    return { success: false, message: `An unexpected error occurred: ${errorMessage}` };
  }
}
