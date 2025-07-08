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

interface SofaDetailsFormProps {
  index: number;
  product: Product;
  handleProductChange: (index: number, field: keyof Product, value: string | number | boolean) => void;
}

export const SofaDetailsForm: React.FC<SofaDetailsFormProps> = ({
  index,
  product,
  handleProductChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {/* Common Text Inputs */}
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

      {/* Sofa-Specific Selects */}
      <Select
        value={product.recliner_mechanism_mode || ""}
        onValueChange={(val) => handleProductChange(index, "recliner_mechanism_mode", val)}
      >
        <SelectTrigger><SelectValue placeholder="Recliner Mechanism Mode" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="motorized_single">Motorized Single</SelectItem>
          <SelectItem value="motorized_double">Motorized Double</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={product.recliner_mechanism_flip || ""}
        onValueChange={(val) => handleProductChange(index, "recliner_mechanism_flip", val)}
      >
        <SelectTrigger><SelectValue placeholder="Recliner Mechanism Flip" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="single_flip">Single Flip</SelectItem>
          <SelectItem value="double_flip">Double Flip</SelectItem>
          <SelectItem value="double_motor_with_headrest">Double Motor with Headrest</SelectItem>
        </SelectContent>
      </Select>

      {/* Boolean fields: Convert boolean to string for Select and back to boolean on change */}
      <Select
        value={product.wood_to_floor === true ? "true" : product.wood_to_floor === false ? "false" : ""}
        onValueChange={(val) => handleProductChange(index, "wood_to_floor", val === "true")}
      >
        <SelectTrigger><SelectValue placeholder="Wood to Floor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Wood to Floor</SelectItem>
          <SelectItem value="false">Metal to Floor</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={product.headrest_mode || ""}
        onValueChange={(val) => handleProductChange(index, "headrest_mode", val)}
      >
        <SelectTrigger><SelectValue placeholder="Headrest Mode" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="motorized">Motorized</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={product.cup_holder || ""}
        onValueChange={(val) => handleProductChange(index, "cup_holder", val)}
      >
        <SelectTrigger><SelectValue placeholder="Cup Holder" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="normal_push_back">Normal Push Back</SelectItem>
          <SelectItem value="chiller_cup">Chiller Cup</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={product.snack_swivel_tray === true ? "true" : product.snack_swivel_tray === false ? "false" : ""}
        onValueChange={(val) => handleProductChange(index, "snack_swivel_tray", val === "true")}
      >
        <SelectTrigger><SelectValue placeholder="Snack Swivel Tray" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Yes</SelectItem>
          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={product.daybed_headrest_mode || ""}
        onValueChange={(val) => handleProductChange(index, "daybed_headrest_mode", val)}
      >
        <SelectTrigger><SelectValue placeholder="Daybed Headrest Mode" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="motorized">Motorized</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={product.daybed_position || ""}
        onValueChange={(val) => handleProductChange(index, "daybed_position", val)}
      >
        <SelectTrigger><SelectValue placeholder="Daybed Position" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="rhs">RHS</SelectItem>
          <SelectItem value="lhs">LHS</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={product.armrest_storage === true ? "true" : product.armrest_storage === false ? "false" : ""}
        onValueChange={(val) => handleProductChange(index, "armrest_storage", val === "true")}
      >
        <SelectTrigger><SelectValue placeholder="Armrest Storage" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Yes</SelectItem>
          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={product.storage_side || ""}
        onValueChange={(val) => handleProductChange(index, "storage_side", val)}
      >
        <SelectTrigger><SelectValue placeholder="Storage Side" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="rhs_arm">RHS Arm</SelectItem>
          <SelectItem value="lhs_arm">LHS Arm</SelectItem>
          <SelectItem value="both_arm">Both Arms</SelectItem>
        </SelectContent>
      </Select>

      {/* Number Inputs - now strictly 'number' type in Product interface */}
      <Input
        placeholder="Foam Density Seating"
        type="number"
        value={product.foam_density_seating || ''}
        onChange={(e) => handleProductChange(index, "foam_density_seating", Number(e.target.value))}
      />
      <Input
        placeholder="Foam Density Backrest"
        type="number"
        value={product.foam_density_backrest || ''}
        onChange={(e) => handleProductChange(index, "foam_density_backrest", Number(e.target.value))}
      />

      <Select
        value={product.belt_details || ""}
        onValueChange={(val) => handleProductChange(index, "belt_details", val)}
      >
        <SelectTrigger><SelectValue placeholder="Belt Details" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="elastic_belt">Elastic Belt</SelectItem>
          <SelectItem value="zig_zag_spring">Zig Zag Spring</SelectItem>
          <SelectItem value="pocket_spring">Pocket Spring</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={product.leg_type || ""}
        onValueChange={(val) => handleProductChange(index, "leg_type", val)}
      >
        <SelectTrigger><SelectValue placeholder="Leg Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="wood">Wood</SelectItem>
          <SelectItem value="pvd">PVD</SelectItem>
          <SelectItem value="ss">SS</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="PVD Color"
        value={product.pvd_color || ""}
        onChange={(e) => handleProductChange(index, "pvd_color", e.target.value)}
      />

      <Select
        value={product.chester_option || ""}
        onValueChange={(val) => handleProductChange(index, "chester_option", val)}
      >
        <SelectTrigger><SelectValue placeholder="Chester Option" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="with_button">With Button</SelectItem>
          <SelectItem value="without_button">Without Button</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Armrest Panels"
        value={product.armrest_panels || ""}
        onChange={(e) => handleProductChange(index, "armrest_panels", e.target.value)}
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

      {/* Dimensional Inputs - now strictly 'number' type in Product interface */}
      <Input
        placeholder="Total Width"
        type="number"
        value={product.total_width || ''}
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
      <Input
        placeholder="Seat Width"
        type="number"
        value={product.seat_width || ''}
        onChange={(e) => handleProductChange(index, "seat_width", Number(e.target.value))}
      />
      <Input
        placeholder="Seat Depth"
        type="number"
        value={product.seat_depth || ''}
        onChange={(e) => handleProductChange(index, "seat_depth", Number(e.target.value))}
      />
      <Input
        placeholder="Seat Height"
        type="number"
        value={product.seat_height || ''}
        onChange={(e) => handleProductChange(index, "seat_height", Number(e.target.value))}
      />
      <Input
        placeholder="Armrest Width"
        type="number"
        value={product.armrest_width || ''}
        onChange={(e) => handleProductChange(index, "armrest_width", Number(e.target.value))}
      />
      <Input
        placeholder="Armrest Depth"
        type="number"
        value={product.armrest_depth || ''}
        onChange={(e) => handleProductChange(index, "armrest_depth", Number(e.target.value))}
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
    </div>
  );
};