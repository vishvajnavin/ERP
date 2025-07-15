'use server';

import { createClient } from '@/utils/supabase/server';
import { Product } from '@/types/products';

export async function getProductDetails(productId: string, productType: 'Sofa' | 'Bed'): Promise<Product | null> {
  const supabase = createClient();
  const tableName = productType === 'Sofa' ? 'sofas' : 'beds';

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product details:', error);
    return null;
  }

  return data as Product;
}
