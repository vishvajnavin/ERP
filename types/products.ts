// types/products.ts
// Assuming this is your Product interface. Adjust fields as per your actual DB schema.

export type ProductType = 'sofa' | 'bed'; // Add other types if needed

export interface Product {
  // Common fields for all products
  id?: string; // Optional for new products
  product_type: ProductType;
  is_existing_model: boolean;
  quantity: number;
  model_name?: string;
  description?: string;
  reference_image_url?: string;
  measurement_drawing_url?: string;
  upholstery?: string;
  upholstery_color?: string;
  total_width?: number;
  total_depth?: number;
  total_height?: number;
  polish_color?: string;
  polish_finish?: string;
  customization?: boolean; // ✨ ADD THIS NEW FIELD ✨

  // Sofa-specific fields
  sofa_product_id?: string;
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
  seat_width?: number;
  seat_depth?: number;
  seat_height?: number;
  armrest_width?: number;
  armrest_depth?: number;

  // Bed-specific fields
  bed_product_id?: string;
  bed_size?: string;
  customized_mattress_size?: string;
  headboard_type?: string;
  storage_option?: string;
  bed_portion?: string;
}