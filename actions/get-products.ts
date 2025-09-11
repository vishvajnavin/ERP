'use server';

import { createClient } from '@/utils/supabase/server';
import { Product } from '@/types/products';
import { getSignedUrls } from './get-signed-urls';

export async function getProducts(
  productType: 'sofa' | 'bed',
  filters: Record<string, string>
): Promise<Product[]> {
  const supabase = await createClient();
  const tableName = productType === 'sofa' ? 'sofa_products' : 'bed_products';

  let queryBuilder = supabase.from(tableName).select('*');

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== 'all') {
        queryBuilder = queryBuilder.eq(key, value);
      }
    }
  }

  const { data: products, error } = await queryBuilder
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error(`Error fetching ${productType}s:`, error);
    return [];
  }

  if (!products) {
    return [];
  }

  // Extract all image paths that need signing
  const imagePaths = products.flatMap(p => {
    const paths = [];
    if (p.reference_image_url) paths.push(p.reference_image_url);
    if (p.measurement_drawing_url) paths.push(p.measurement_drawing_url);
    return paths;
  });

  // Get all signed URLs in one go
  const signedUrlMap = await getSignedUrls(imagePaths);

  // Map the signed URLs back to the products
  const productsWithSignedUrls = products.map(product => ({
    ...product,
    reference_image_url: product.reference_image_url ? signedUrlMap[product.reference_image_url] : null,
    measurement_drawing_url: product.measurement_drawing_url ? signedUrlMap[product.measurement_drawing_url] : null,
  }));

  return productsWithSignedUrls;
}
