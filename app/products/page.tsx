// app/products/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client'; // Correct: Use the client-side createClient
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ProductHeaderActions from "@/components/products/product-header-actions";
import EditProductModal from '@/components/products/edit-product-modal';
import { Product } from '@/types/products';
import { SearchBar } from '@/components/products/search-bar';

// Note: Supabase client is now initialized inside the function that uses it.

export default function ProductsPage() {
  const [productType, setProductType] = useState<'sofa' | 'bed'>('sofa');
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const fetchInitialProducts = useCallback(async () => {
    setLoading(true);
    const supabase = createClient(); // Initialize client here
    const tableName = productType === 'sofa' ? 'sofa_products' : 'bed_products';

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error(`Error fetching ${productType}s:`, error);
      setProducts([]);
      setDisplayedProducts([]);
    } else {
      const fetchedProducts = data as Product[];
      setProducts(fetchedProducts);
      setDisplayedProducts(fetchedProducts);
    }
    setLoading(false);
  }, [productType]);

  useEffect(() => {
    fetchInitialProducts();
  }, [fetchInitialProducts]);

  // NEW: Create a stable search handler function with useCallback.
  // This function will be passed to the SearchBar component.
  const handleSearch = useCallback((searchResults: Product[]) => {
    setDisplayedProducts(searchResults);
  }, []); // Dependency array is empty as setDisplayedProducts is stable.

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <div className="flex items-center gap-4">
          <SearchBar
            initialProducts={products}
            onSearch={handleSearch} // UPDATED: Use the new stable handler
            productType={productType}
          />
          <ProductHeaderActions />
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-8">
        <Button 
          onClick={() => setProductType('sofa')}
          variant={productType === 'sofa' ? 'default' : 'outline'}
        >
          Sofas
        </Button>
        <Button 
          onClick={() => setProductType('bed')}
          variant={productType === 'bed' ? 'default' : 'outline'}
        >
          Beds
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayedProducts.map((product) => (
            <Card key={`${productType}-${product.id}`}>
              <CardContent className="p-0">
                <div className="relative h-64 bg-gray-100 ">
                  {product.reference_image_url ? (
                    <Image
                      src={product.reference_image_url}
                      alt={product.model_name || 'Product Image'}
                      fill={true}
                      style={{objectFit: "cover"}}
                      className="rounded-t-lg"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle>{product.model_name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => handleEditClick(product)}>
                  Edit
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">No {productType}s found. Add one to get started!</p>
        </div>
      )}
      <EditProductModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        product={selectedProduct} 
      />
    </div>
  );
}
