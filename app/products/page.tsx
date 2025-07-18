// app/products/page.tsx
'use client'; // This component is now interactive

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ProductHeaderActions from "@/components/products/product-header-actions";
import EditProductModal from '@/components/products/edit-product-modal';
import { Product } from '@/types/products';

// Create the Supabase client once
const supabase = createClient();

export default function ProductsPage() {
  const [productType, setProductType] = useState<'sofa' | 'bed'>('sofa');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      const tableName = productType === 'sofa' ? 'sofa_products' : 'bed_products';

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`Error fetching ${productType}s:`, error);
        setProducts([]);
      } else {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [productType]); // Re-run this effect whenever productType changes

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <div className="flex-shrink-0">
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
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
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
                      // Basic fallback in case of image loading error
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
