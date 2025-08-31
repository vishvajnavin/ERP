// actions/update-product.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

// Helper to convert empty strings/invalid numbers to null
const getNullIfEmpty = (value: FormDataEntryValue | null) => (value === '' ? null : value);
const getNumberOrNull = (value: FormDataEntryValue | null) => {
    const str = getNullIfEmpty(value);
    if (str === null) return null;
    const num = Number(str);
    return isNaN(num) ? null : num;
}

export async function updateProductAction(formData: FormData) {
    const supabase = createClient();

    const productType = formData.get('product_type');
    const idValue = formData.get('id');

    if (!idValue || !productType) {
        return { success: false, message: 'Missing product ID or type.' };
    }

    const id = parseInt(String(idValue), 10);

    if (isNaN(id)) {
        return { success: false, message: 'Invalid product ID.' };
    }

    try {
        let updateData;
        const tableName = productType === 'sofa' ? 'sofa_products' : 'bed_products';

        if (productType === 'sofa') {
            updateData = {
                model_name: formData.get('model_name'),
                model_family_configuration: getNullIfEmpty(formData.get('model_family_configuration')),
                // --- MODIFIED LINES ---
                "2_seater_length": getNumberOrNull(formData.get('2_seater_length')) ?? 0,
                "1_seater_length": getNumberOrNull(formData.get('1_seater_length')) ?? 0,
                // --- END OF MODIFICATION ---
                description: getNullIfEmpty(formData.get('description')),
                reference_image_url: getNullIfEmpty(formData.get('reference_image_url')),
                measurement_drawing_url: getNullIfEmpty(formData.get('measurement_drawing_url')),
                recliner_mechanism_mode: getNullIfEmpty(formData.get('recliner_mechanism_mode')),
                recliner_mechanism_flip: getNullIfEmpty(formData.get('recliner_mechanism_flip')),
                headrest_mode: getNullIfEmpty(formData.get('headrest_mode')),
                cup_holder: getNullIfEmpty(formData.get('cup_holder')),
                daybed_headrest_mode: getNullIfEmpty(formData.get('daybed_headrest_mode')),
                daybed_position: getNullIfEmpty(formData.get('daybed_position')),
                storage_side: getNullIfEmpty(formData.get('storage_side')),
                snack_swivel_tray: formData.get('snack_swivel_tray') === 'true',
                armrest_storage: formData.get('armrest_storage') === 'true',
                foam_density_seating: getNumberOrNull(formData.get('foam_density_seating')),
                foam_density_backrest: getNumberOrNull(formData.get('foam_density_backrest')),
                belt_details: getNullIfEmpty(formData.get('belt_details')),
                leg_type: getNullIfEmpty(formData.get('leg_type')),
                pvd_color: getNullIfEmpty(formData.get('pvd_color')),
                chester_option: getNullIfEmpty(formData.get('chester_option')),
                armrest_panels: getNullIfEmpty(formData.get('armrest_panels')),
                wood_to_floor: formData.get('wood_to_floor') === 'true',
                total_width: getNumberOrNull(formData.get('total_width')),
                total_depth: getNumberOrNull(formData.get('total_depth')),
                total_height: getNumberOrNull(formData.get('total_height')),
                seat_height: getNumberOrNull(formData.get('seat_height')),
                seat_depth: getNullIfEmpty(formData.get('seat_depth')),
                seat_width: getNumberOrNull(formData.get('seat_width')),
                armrest_width: getNumberOrNull(formData.get('armrest_width')),
                armrest_depth: getNumberOrNull(formData.get('armrest_depth')),
                upholstery: getNullIfEmpty(formData.get('upholstery')),
                upholstery_color: getNullIfEmpty(formData.get('upholstery_color')),
                polish_color: getNullIfEmpty(formData.get('polish_color')),
                polish_finish: getNullIfEmpty(formData.get('polish_finish')),
            };
        } else { // bed
            updateData = {
                model_name: formData.get('model_name'),
                description: getNullIfEmpty(formData.get('description')),
                reference_image_url: getNullIfEmpty(formData.get('reference_image_url')),
                measurement_drawing_url: getNullIfEmpty(formData.get('measurement_drawing_url')),
                bed_size: getNullIfEmpty(formData.get('bed_size')),
                customized_mattress_size: getNullIfEmpty(formData.get('customized_mattress_size')),
                headboard_type: getNullIfEmpty(formData.get('headboard_type')),
                storage_option: getNullIfEmpty(formData.get('storage_option')),
                bed_portion: getNullIfEmpty(formData.get('bed_portion')),
                total_width: getNumberOrNull(formData.get('total_width')),
                total_depth: getNumberOrNull(formData.get('total_depth')),
                total_height: getNumberOrNull(formData.get('total_height')),
                upholstery: getNullIfEmpty(formData.get('upholstery')),
                upholstery_color: getNullIfEmpty(formData.get('upholstery_color')),
                polish_color: getNullIfEmpty(formData.get('polish_color')),
                polish_finish: getNullIfEmpty(formData.get('polish_finish')),
            };
        }

        const { error } = await supabase
            .from(tableName)
            .update(updateData)
            .eq('id', id)
        if (error) throw error;

        revalidatePath('/products');
        return { success: true, message: 'Product updated successfully!' };

    } catch (error: unknown) {
        console.error('Error updating product:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, message: `Failed to update product: ${errorMessage}` };
    }
}
