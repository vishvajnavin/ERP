"use server";

import { createClient } from "@/utils/supabase/server";
import { Product } from "@/types/products";

export async function searchProducts(
  query: string,
  productType: "sofa" | "bed",
  filters?: Record<string, string>
): Promise<Product[]> {
  const supabase = createClient();
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

  // The return type of the RPC now perfectly matches what we need.
  // Ensure your `Product` type includes `id`, `model_name`, and optionally `product_type`.
  return products || [];
}
