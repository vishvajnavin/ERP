// app/products/page.tsx
// NO 'use client' - This is a Server Component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import ProductHeaderActions from "@/components/products/product-header-actions";

// NOTE: You would replace this with your actual Supabase fetching logic
async function getProducts() {
  console.log("Fetching products on the server...");
  // Example: const { data: products } = await supabase.from('all_products_view').select('*');
  // For now, we'll use the static data as a placeholder.
  return [
    { id: 1, name: "Classic Sofa", description: "A timeless piece for any living room.", image: "/sofa.jpg" },
    { id: 2, name: "Modern Armchair", description: "Sleek design with maximum comfort.", image: "/armchair.jpg" },
    { id: 3, name: "Wooden Coffee Table", description: "Handcrafted from solid oak.", image: "/coffee-table.jpg" },
    { id: 4, name: "King Size Bed", description: "Sleep like royalty in this spacious bed.", image: "/bed.jpg" },
    { id: 5, name: "Dining Set", description: "Perfect for family gatherings.", image: "/dining-set.jpg" },
    { id: 6, name: "Bookshelf", description: "Organize your favorite reads in style.", image: "/bookshelf.jpg" },
  ];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        {/* All client-side interactivity is handled in this component */}
        <ProductHeaderActions />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-0">
              <div className="relative h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill={true}
                  style={{objectFit: "cover"}}
                  className="rounded-t-lg"
                />
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}