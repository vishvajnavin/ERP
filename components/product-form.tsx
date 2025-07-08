import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component

// --- Adjust paths based on your actual file structure ---
import { Product } from "@/types/products"; // Import the Product type
import { BedDetailsForm } from "./bed-details"; // Assuming BedDetailsForm.tsx
import { SofaDetailsForm } from "./sofa-details"; // Assuming SofaDetailsForm.tsx

// Define a type for your existing models (if not already in types/product)
export interface ExistingModel {
  id: string;
  model_name: string;
  // Add other properties that an existing model might have
}

interface ProductFormProps {
  index: number;
  product: Product;
  handleProductChange: (
    index: number,
    field: keyof Product,
    value: string | number | boolean | undefined
  ) => void;
  sofaModels: ExistingModel[]; // Array of existing sofa models
  bedModels: ExistingModel[]; // Array of existing bed models
}

export const ProductForm: React.FC<ProductFormProps> = ({
  index,
  product,
  handleProductChange,
  sofaModels,
  bedModels,
}) => {
  return (
    <Card className="p-4 my-4">
      {/* Top-level Product Form - Grid layout for common fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Type Selection */}
        <Select
          value={product.product_type || ''}
          onValueChange={(val) => handleProductChange(index, 'product_type', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Product Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sofa">Sofa</SelectItem>
            <SelectItem value="bed">Bed</SelectItem>
            {/* Add more product types if needed */}
          </SelectContent>
        </Select>

        {/* Existing Model or New Specification Selection */}
        <Select
          // Convert boolean to string for Select component
          value={product.is_existing_model === true ? 'true' : product.is_existing_model === false ? 'false' : ''}
          // Convert string back to boolean on change
          onValueChange={(val) => handleProductChange(index, 'is_existing_model', val === 'true')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Existing or New" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Existing Model</SelectItem>
            <SelectItem value="false">New Custom Specification</SelectItem>
          </SelectContent>
        </Select>

        {/* Quantity Input - now strictly 'number' type in Product interface */}
        <Input
          type="number"
          min={1}
          placeholder="Quantity"
          value={product.quantity || ''} // Use || '' to display empty for undefined/null/0
          onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)} // Parse to int, default to 1
        />
      </div>

      {/* Conditional Rendering for Existing Model Selection */}
      {product.product_type === 'sofa' && product.is_existing_model && (
        <div className="mt-4">
          <Select
            value={product.sofa_product_id || ''}
            onValueChange={(val) => handleProductChange(index, 'sofa_product_id', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Sofa Model" />
            </SelectTrigger>
            <SelectContent>
              {sofaModels.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {product.product_type === 'bed' && product.is_existing_model && (
        <div className="mt-4">
          <Select
            value={product.bed_product_id || ''}
            onValueChange={(val) => handleProductChange(index, 'bed_product_id', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Bed Model" />
            </SelectTrigger>
            <SelectContent>
              {bedModels.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Conditional Rendering for Custom Specification Details Forms */}
      {product.product_type === 'sofa' && !product.is_existing_model && (
        <SofaDetailsForm
          index={index}
          product={product}
          handleProductChange={handleProductChange}
        />
      )}
      {product.product_type === 'bed' && !product.is_existing_model && (
        <BedDetailsForm
          index={index}
          product={product}
          handleProductChange={handleProductChange}
        />
      )}
    </Card>
  );
};