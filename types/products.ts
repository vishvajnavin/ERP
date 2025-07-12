// types/products.ts
// Assuming this is your Product interface. Adjust fields as per your actual DB schema.

export type ProductType = 'sofa' | 'bed'; // Add other types if needed

export interface Product {
    product_type?: 'sofa' | 'bed';
    is_existing_model?: boolean;
    is_customization?: boolean;
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
    foam_density_seating?: number;
    foam_density_backrest?: number;
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
    // For new bed
    bed_size?: string;
    customized_mattress_size?: string;
    headboard_type?: string;
    storage_option?: string;
    bed_portion?: string;
  }
