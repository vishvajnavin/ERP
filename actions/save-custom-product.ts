'use server';

import { createClient } from '@/utils/supabase/server';
import { Product } from '@/types/products';

export async function saveCustomProduct(product: Product) {
  const supabase = createClient();

  let tableName = '';
  if (product.product_type === 'sofa') {
    tableName = 'sofa_products';
  } else if (product.product_type === 'bed') {
    tableName = 'bed_products';
  } else {
    return { error: 'Invalid product type' };
  }

  const { data, error } = await supabase
    .from(tableName)
    .insert([product])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}
