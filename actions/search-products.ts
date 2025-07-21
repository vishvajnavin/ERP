"use server";

import { createClient } from "@/utils/supabase/server";
import { Product } from "@/types/products";

export async function searchProducts(
  query: string,
  productType: "sofa" | "bed"
): Promise<Product[]> {
  // Return empty if the query is empty after trimming
  if (!query.trim()) {
    // When the search is cleared, the parent component will handle
    // showing the initial list. Returning an empty array is correct here.
    return [];
  }

  const supabase = createClient();

  // Call the new database function with the correct parameters
  const { data: products, error } = await supabase.rpc("search_products_by_type", {
    search_query: query,
    p_type: productType,
  });

  if (error) {
    console.error("Error searching products via RPC:", error);
    return [];
  }

  // The return type of the RPC now perfectly matches what we need.
  // Ensure your `Product` type includes `id`, `model_name`, and optionally `product_type`.
  return products || [];
}
