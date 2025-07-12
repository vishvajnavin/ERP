import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Assuming 'Product' type is imported from a shared types file:
import { Product } from "@/types/products"; // Adjust path as per your project structure

interface BedDetailsFormProps {
  index: number;
  product: Product;
  handleProductChange: (index: number, field: keyof Product, value: Product[keyof Product]) => void;
}

export const BedDetailsForm: React.FC<BedDetailsFormProps> = ({
  index,
  product,
  handleProductChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {/* Text Inputs */}
      <Input
        placeholder="Model Name"
        value={product.model_name || ""}
        onChange={(e) => handleProductChange(index, "model_name", e.target.value)}
      />
      <Input
        placeholder="Reference Image URL"
        value={product.reference_image_url || ""}
        onChange={(e) => handleProductChange(index, "reference_image_url", e.target.value)}
      />
      <Input
        placeholder="Measurement Drawing URL"
        value={product.measurement_drawing_url || ""}
        onChange={(e) => handleProductChange(index, "measurement_drawing_url", e.target.value)}
      />
      <Textarea
        placeholder="Description"
        value={product.description || ""}
        onChange={(e) => handleProductChange(index, "description", e.target.value)}
      />

      {/* Selects */}
      <Select
        value={product.bed_size || ""}
        onValueChange={(val) => handleProductChange(index, "bed_size", val)}
      >
        <SelectTrigger><SelectValue placeholder="Bed Size" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="king">King</SelectItem>
          <SelectItem value="queen">Queen</SelectItem>
          <SelectItem value="customized">Customized</SelectItem>
        </SelectContent>
      </Select>

      {product.bed_size === "customized" && (
        <Input
          placeholder="Custom Mattress Size"
          value={product.customized_mattress_size || ""}
          onChange={(e) => handleProductChange(index, "customized_mattress_size", e.target.value)}
        />
      )}

      <Select
        value={product.headboard_type || ""}
        onValueChange={(val) => handleProductChange(index, "headboard_type", val)}
      >
        <SelectTrigger><SelectValue placeholder="Headboard Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="medium_back_4ft">Medium Back 4ft</SelectItem>
          <SelectItem value="high_back_4_5ft">High Back 4.5ft</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={product.storage_option || ""}
        onValueChange={(val) => handleProductChange(index, "storage_option", val)}
      >
        <SelectTrigger><SelectValue placeholder="Storage Option" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="hydraulic">Hydraulic</SelectItem>
          <SelectItem value="channel">Channel</SelectItem>
          <SelectItem value="motorised">Motorised</SelectItem>
          <SelectItem value="without_storage">Without Storage</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={product.bed_portion || ""}
        onValueChange={(val) => handleProductChange(index, "bed_portion", val)}
      >
        <SelectTrigger><SelectValue placeholder="Bed Portion" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="single">Single</SelectItem>
          <SelectItem value="double">Double</SelectItem>
        </SelectContent>
      </Select>

      {/* Number Inputs - now strictly 'number' type in Product interface */}
      <Input
        placeholder="Total Width"
        type="number"
        value={product.total_width || ''} // Use || '' to display empty for undefined/null/0
        onChange={(e) => handleProductChange(index, "total_width", Number(e.target.value))}
      />
      <Input
        placeholder="Total Depth"
        type="number"
        value={product.total_depth || ''}
        onChange={(e) => handleProductChange(index, "total_depth", Number(e.target.value))}
      />
      <Input
        placeholder="Total Height"
        type="number"
        value={product.total_height || ''}
        onChange={(e) => handleProductChange(index, "total_height", Number(e.target.value))}
      />

      <Select
        value={product.upholstery || ""}
        onValueChange={(val) => handleProductChange(index, "upholstery", val)}
      >
        <SelectTrigger><SelectValue placeholder="Upholstery" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="fabric">Fabric</SelectItem>
          <SelectItem value="pu">PU</SelectItem>
          <SelectItem value="leather_bloom">Leather Bloom</SelectItem>
          <SelectItem value="leather_floater">Leather Floater</SelectItem>
          <SelectItem value="leather_floater_max">Leather Floater Max</SelectItem>
          <SelectItem value="leather_platinum_max">Leather Platinum Max</SelectItem>
          <SelectItem value="leather_european_nappa">Leather European Nappa</SelectItem>
          <SelectItem value="leather_smoothy_nappa">Leather Smoothy Nappa</SelectItem>
          <SelectItem value="pu_leather">PU Leather</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Upholstery Color"
        value={product.upholstery_color || ""}
        onChange={(e) => handleProductChange(index, "upholstery_color", e.target.value)}
      />
      <Input
        placeholder="Polish Color"
        value={product.polish_color || ""}
        onChange={(e) => handleProductChange(index, "polish_color", e.target.value)}
      />

      <Select
        value={product.polish_finish || ""}
        onValueChange={(val) => handleProductChange(index, "polish_finish", val)}
      >
        <SelectTrigger><SelectValue placeholder="Polish Finish" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="matt_finish">Matt Finish</SelectItem>
          <SelectItem value="glossy_finish">Glossy Finish</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};