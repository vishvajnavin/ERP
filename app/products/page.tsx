import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Classic Sofa",
    description: "A timeless piece for any living room.",
    image: "/sofa.jpg",
  },
  {
    id: 2,
    name: "Modern Armchair",
    description: "Sleek design with maximum comfort.",
    image: "/armchair.jpg",
  },
  {
    id: 3,
    name: "Wooden Coffee Table",
    description: "Handcrafted from solid oak.",
    image: "/coffee-table.jpg",
  },
  {
    id: 4,
    name: "King Size Bed",
    description: "Sleep like royalty in this spacious bed.",
    image: "/bed.jpg",
  },
  {
    id: 5,
    name: "Dining Set",
    description: "Perfect for family gatherings.",
    image: "/dining-set.jpg",
  },
  {
    id: 6,
    name: "Bookshelf",
    description: "Organize your favorite reads in style.",
    image: "/bookshelf.jpg",
  },
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-0">
              <div className="relative h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
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
