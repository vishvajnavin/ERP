"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/products";
import { searchProducts } from "@/actions/search-products";

interface SearchBarProps {
  onSearch: (filteredProducts: Product[]) => void;
  initialProducts: Product[];
  productType: "sofa" | "bed";
}

export function SearchBar({
  onSearch,
  initialProducts,
  productType,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim() === "") {
      onSearch(initialProducts);
      return;
    }

    const handler = setTimeout(async () => {
      const filtered = await searchProducts(searchQuery, productType);
      onSearch(filtered);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, onSearch, initialProducts, productType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search by model name or ID..."
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
}
