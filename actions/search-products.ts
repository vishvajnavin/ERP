"use server";

import { createClient } from "@/utils/supabase/server";
import { Product } from "@/types/products";
import { getSignedUrl } from "./get-signed-url";

export async function searchProducts(
  query: string,
  productType: "sofa" | "bed",
  filters?: Record<string, string>
): Promise<Product[]> {
  const supabase = await createClient();
  let queryBuilder = supabase.from(productType === 'sofa' ? 'sofa_products' : 'bed_products').select('*');

  if (query.trim()) {
    queryBuilder = queryBuilder.ilike('model_name', `%${query}%`);
  }

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== 'all') {
        queryBuilder = queryBuilder.eq(key, value);
      }
    }
  }

  const { data: products, error } = await queryBuilder;

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

  if (!products) {
    return [];
  }

  // Create signed URLs for the images
  const productsWithSignedUrls = await Promise.all(
    products.map(async (product) => {
      let signedReferenceUrl = null;
      if (product.reference_image_url && typeof product.reference_image_url === 'string') {
        signedReferenceUrl = await getSignedUrl(product.reference_image_url);
      }

      let signedMeasurementUrl = null;
      if (product.measurement_drawing_url && typeof product.measurement_drawing_url === 'string') {
        signedMeasurementUrl = await getSignedUrl(product.measurement_drawing_url);
      }

      return {
        ...product,
        reference_image_url: signedReferenceUrl,
        measurement_drawing_url: signedMeasurementUrl,
      };
    })
  );

  return productsWithSignedUrls;
}
