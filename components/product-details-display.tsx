// components/product-details-display.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/products"; // Assuming Product contains all relevant fields

interface ProductDetailsDisplayProps {
  product: Product; // This product object will contain the fetched details
}

export const ProductDetailsDisplay: React.FC<ProductDetailsDisplayProps> = ({ product }) => {
  if (!product) {
    return <p className="text-gray-500 italic mt-4">No model details to display.</p>;
  }

  // Helper to render an input field if the value exists
  const renderInputField = (label: string, value: string | number | boolean | undefined) => {
    if (value === undefined || value === null || value === "") return null;
    return (
      <div>
        <Label className="block text-sm font-medium text-gray-700">{label}</Label>
        <Input
          value={String(value)} // Ensure value is a string for the input
          disabled // Make it read-only
          className="bg-gray-100 cursor-not-allowed"
        />
      </div>
    );
  };

  return (
    <div className="mt-6 p-4 border rounded-md bg-gray-50 space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Model Details (Read-Only)</h3>
      <p className="text-sm text-gray-600">These details are fetched from the database for the selected existing model.</p>

      {renderInputField("Model Name", product.model_name)}
      {renderInputField("Description", product.description)}
      {renderInputField("Reference Image URL", product.reference_image_url)}
      {renderInputField("Measurement Drawing URL", product.measurement_drawing_url)}
      {renderInputField("Upholstery", product.upholstery)}
      {renderInputField("Upholstery Color", product.upholstery_color)}
      {renderInputField("Total Width (cm)", product.total_width)}
      {renderInputField("Total Depth (cm)", product.total_depth)}
      {renderInputField("Total Height (cm)", product.total_height)}
      {renderInputField("Polish Color", product.polish_color)}
      {renderInputField("Polish Finish", product.polish_finish)}


      {/* Sofa-specific details */}
      {product.product_type === 'sofa' && (
        <>
          <h4 className="text-lg font-medium text-gray-700 mt-4">Sofa Specifics</h4>
          {renderInputField("Recliner Mechanism Mode", product.recliner_mechanism_mode)}
          {renderInputField("Recliner Mechanism Flip", product.recliner_mechanism_flip ? "Yes" : "No")}
          {renderInputField("Wood to Floor", product.wood_to_floor ? "Yes" : "No")}
          {renderInputField("Headrest Mode", product.headrest_mode)}
          {renderInputField("Cup Holder", product.cup_holder ? "Yes" : "No")}
          {renderInputField("Snack Swivel Tray", product.snack_swivel_tray ? "Yes" : "No")}
          {renderInputField("Daybed Headrest Mode", product.daybed_headrest_mode)}
          {renderInputField("Daybed Position", product.daybed_position)}
          {renderInputField("Armrest Storage", product.armrest_storage ? "Yes" : "No")}
          {renderInputField("Storage Side", product.storage_side)}
          {renderInputField("Foam Density Seating", product.foam_density_seating)}
          {renderInputField("Foam Density Backrest", product.foam_density_backrest)}
          {renderInputField("Belt Details", product.belt_details)}
          {renderInputField("Leg Type", product.leg_type)}
          {renderInputField("PVD Color", product.pvd_color)}
          {renderInputField("Chester Option", product.chester_option)}
          {renderInputField("Armrest Panels", product.armrest_panels)}
          {renderInputField("Seat Width (cm)", product.seat_width)}
          {renderInputField("Seat Depth (cm)", product.seat_depth)}
          {renderInputField("Seat Height (cm)", product.seat_height)}
          {renderInputField("Armrest Width (cm)", product.armrest_width)}
          {renderInputField("Armrest Depth (cm)", product.armrest_depth)}
        </>
      )}

      {/* Bed-specific details */}
      {product.product_type === 'bed' && (
        <>
          <h4 className="text-lg font-medium text-gray-700 mt-4">Bed Specifics</h4>
          {renderInputField("Bed Size", product.bed_size)}
          {renderInputField("Customized Mattress Size", product.customized_mattress_size)}
          {renderInputField("Headboard Type", product.headboard_type)}
          {renderInputField("Storage Option", product.storage_option)}
          {renderInputField("Bed Portion", product.bed_portion)}
        </>
      )}
    </div>
  );
};