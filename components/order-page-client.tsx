// components/order-page-client.tsx
'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/products"; // Adjust path to your types file
import { ProductForm } from "./product-form"; // Adjust path to ProductForm component

// Import the Server Action
import { submitOrder, ProductItem } from '@/actions/submit-order'; // Adjust path if necessary

// --- Interfaces for Data (Prop types for this client component) ---
interface SofaModel {
  id: string;
  model_name: string;
}

interface BedModel {
  id: string;
  model_name: string;
}

interface Customer {
  id: string;
  customer_name: string;
}

// --- Define the overall structure of your form state ---
interface OrderFormState {
  selectedCustomerId: string; // Changed to ID for customer selection
  totalProducts: number;
  products: Product[]; // Array of Product objects
}

// Props for the client component
interface OrderPageClientProps {
  initialCustomers: Customer[];
  initialSofaModels: SofaModel[];
  initialBedModels: BedModel[];
}

const OrderPageClient: React.FC<OrderPageClientProps> = ({
  initialCustomers,
  initialSofaModels,
  initialBedModels,
}) => {
  const [formData, setFormData] = useState<OrderFormState>({
    selectedCustomerId: initialCustomers.length > 0 ? initialCustomers[0].id : "",
    totalProducts: 0,
    products: [
      {
        product_type: "sofa",
        is_existing_model: true,
        quantity: 1,
        sofa_product_id: initialSofaModels[0]?.id || undefined,
      } as Product,
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);


  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      totalProducts: prev.products.length,
    }));
  }, [formData.products]);

  const handleFormChange = (
    field: keyof OrderFormState,
    value: string | number | Product[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearSofaCustomFields = (product: Product): Product => {
    const clearedProduct = { ...product };
    clearedProduct.model_name = undefined;
    clearedProduct.reference_image_url = undefined;
    clearedProduct.measurement_drawing_url = undefined;
    clearedProduct.description = undefined;
    clearedProduct.recliner_mechanism_mode = undefined;
    clearedProduct.recliner_mechanism_flip = undefined;
    clearedProduct.wood_to_floor = undefined;
    clearedProduct.headrest_mode = undefined;
    clearedProduct.cup_holder = undefined;
    clearedProduct.snack_swivel_tray = undefined;
    clearedProduct.daybed_headrest_mode = undefined;
    clearedProduct.daybed_position = undefined;
    clearedProduct.armrest_storage = undefined;
    clearedProduct.storage_side = undefined;
    clearedProduct.foam_density_seating = undefined;
    clearedProduct.foam_density_backrest = undefined;
    clearedProduct.belt_details = undefined;
    clearedProduct.leg_type = undefined;
    clearedProduct.pvd_color = undefined;
    clearedProduct.chester_option = undefined;
    clearedProduct.armrest_panels = undefined;
    clearedProduct.polish_color = undefined;
    clearedProduct.polish_finish = undefined;
    clearedProduct.seat_width = undefined;
    clearedProduct.seat_depth = undefined;
    clearedProduct.seat_height = undefined;
    clearedProduct.armrest_width = undefined;
    clearedProduct.armrest_depth = undefined;
    clearedProduct.upholstery = undefined;
    clearedProduct.upholstery_color = undefined;
    clearedProduct.total_width = undefined;
    clearedProduct.total_depth = undefined;
    clearedProduct.total_height = undefined;
    return clearedProduct;
  };

  const clearBedCustomFields = (product: Product): Product => {
    const clearedProduct = { ...product };
    clearedProduct.model_name = undefined;
    clearedProduct.reference_image_url = undefined;
    clearedProduct.measurement_drawing_url = undefined;
    clearedProduct.description = undefined;
    clearedProduct.bed_size = undefined;
    clearedProduct.customized_mattress_size = undefined;
    clearedProduct.headboard_type = undefined;
    clearedProduct.storage_option = undefined;
    clearedProduct.bed_portion = undefined;
    clearedProduct.polish_color = undefined;
    clearedProduct.polish_finish = undefined;
    clearedProduct.upholstery = undefined;
    clearedProduct.upholstery_color = undefined;
    clearedProduct.total_width = undefined;
    clearedProduct.total_depth = undefined;
    clearedProduct.total_height = undefined;
    return clearedProduct;
  };

  const handleProductChange = (
    index: number,
    field: keyof Product,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => {
      const newProducts = [...prev.products];
      let updatedProduct: Product = {
        ...newProducts[index],
        [field]: value,
      };

      if (field === 'product_type') {
          updatedProduct.sofa_product_id = undefined;
          updatedProduct.bed_product_id = undefined;

          if (newProducts[index]?.product_type === 'sofa') {
              updatedProduct = clearSofaCustomFields(updatedProduct);
          } else if (newProducts[index]?.product_type === 'bed') {
              updatedProduct = clearBedCustomFields(updatedProduct);
          }

          if (value === 'sofa' && initialSofaModels.length > 0) {
            updatedProduct.is_existing_model = true;
            updatedProduct.sofa_product_id = initialSofaModels[0].id;
          } else if (value === 'bed' && initialBedModels.length > 0) {
            updatedProduct.is_existing_model = true;
            updatedProduct.bed_product_id = initialBedModels[0].id;
          } else {
            updatedProduct.is_existing_model = false;
          }
      }

      if (field === 'is_existing_model') {
          if (value === true) {
              if (updatedProduct.product_type === 'sofa') {
                  updatedProduct = clearSofaCustomFields(updatedProduct);
                  updatedProduct.sofa_product_id = initialSofaModels[0]?.id || undefined;
              } else if (updatedProduct.product_type === 'bed') {
                  updatedProduct = clearBedCustomFields(updatedProduct);
                  updatedProduct.bed_product_id = initialBedModels[0]?.id || undefined;
              }
          } else {
              updatedProduct.sofa_product_id = undefined;
              updatedProduct.bed_product_id = undefined;
          }
      }

      newProducts[index] = updatedProduct;

      return {
        ...prev,
        products: newProducts,
      };
    });
  };

  const addProduct = () => {
    setFormData((prev) => {
      const newProducts = [
        ...prev.products,
        {
          product_type: "sofa",
          is_existing_model: true,
          quantity: 1,
          sofa_product_id: initialSofaModels[0]?.id || undefined,
        } as Product,
      ];
      return {
        ...prev,
        products: newProducts,
      };
    });
  };

  const removeProduct = (index: number) => {
    setFormData((prev) => {
      const newProducts = prev.products.filter((_, i) => i !== index);
      return {
        ...prev,
        products: newProducts,
      };
    });
  };

  // Handle form submission using the Server Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage(null);
    setIsError(false);

    // Convert Product[] to ProductItem[] as expected by the Server Action
    const productsToSend: ProductItem[] = formData.products.map(product => {
        // Create a new object to ensure only properties defined in ProductItem are sent
        // This also helps in clearing out properties not relevant to the current product type/model status
        const item: ProductItem = {
            is_existing_model: product.is_existing_model ?? false,
            product_type: product.product_type ?? "sofa",
            quantity: product.quantity,
        };

        if (product.is_existing_model) {
            if (product.product_type === 'sofa') {
                item.sofa_product_id = product.sofa_product_id;
            } else if (product.product_type === 'bed') {
                item.bed_product_id = product.bed_product_id;
            }
        } else {
            // Include common custom fields
            item.model_name = product.model_name;
            item.description = product.description;
            item.reference_image_url = product.reference_image_url;
            item.measurement_drawing_url = product.measurement_drawing_url;
            item.upholstery = product.upholstery;
            item.upholstery_color = product.upholstery_color;
            item.total_width = product.total_width;
            item.total_depth = product.total_depth;
            item.total_height = product.total_height;
            item.polish_color = product.polish_color;
            item.polish_finish = product.polish_finish;


            if (product.product_type === 'sofa') {
                // Sofa-specific custom fields
                item.recliner_mechanism_mode = product.recliner_mechanism_mode;
                item.recliner_mechanism_flip = typeof product.recliner_mechanism_flip === "string"
                  ? product.recliner_mechanism_flip === "true"
                  : product.recliner_mechanism_flip;
                item.wood_to_floor = product.wood_to_floor;
                item.headrest_mode = product.headrest_mode;
                item.cup_holder = typeof product.cup_holder === "string"
                  ? product.cup_holder === "true"
                  : product.cup_holder;
                item.snack_swivel_tray = product.snack_swivel_tray;
                item.daybed_headrest_mode = product.daybed_headrest_mode;
                item.daybed_position = product.daybed_position;
                item.armrest_storage = product.armrest_storage;
                item.storage_side = product.storage_side;
                item.foam_density_seating = product.foam_density_seating !== undefined ? String(product.foam_density_seating) : undefined;
                item.foam_density_backrest = product.foam_density_backrest !== undefined ? String(product.foam_density_backrest) : undefined;
                item.belt_details = product.belt_details;
                item.leg_type = product.leg_type;
                item.pvd_color = product.pvd_color;
                item.chester_option = product.chester_option;
                item.armrest_panels = product.armrest_panels;
                item.seat_width = product.seat_width;
                item.seat_depth = product.seat_depth;
                item.seat_height = product.seat_height;
                item.armrest_width = product.armrest_width;
                item.armrest_depth = product.armrest_depth;
            } else if (product.product_type === 'bed') {
                // Bed-specific custom fields
                item.bed_size = product.bed_size;
                item.customized_mattress_size = product.customized_mattress_size;
                item.headboard_type = product.headboard_type;
                item.storage_option = product.storage_option;
                item.bed_portion = product.bed_portion;
            }
        }
        return item;
    });

    const result = await submitOrder({
      selectedCustomer: formData.selectedCustomerId,
      totalProducts: formData.totalProducts,
      products: productsToSend,
    });

    if (result.success) {
      setSubmissionMessage(result.message);
      setIsError(false);
      // Optionally reset form after successful submission
      // setFormData({ /* initial state */ });
    } else {
      setSubmissionMessage(result.message);
      setIsError(true);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Product Order Form</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer and Total Products Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-md">
          <div>
            <Label htmlFor="selectedCustomerId" className="mb-2 block text-gray-700">Selected Customer</Label>
            <select
              id="selectedCustomerId"
              value={formData.selectedCustomerId}
              onChange={(e) => handleFormChange("selectedCustomerId", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a Customer</option>
              {initialCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.customer_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="totalProducts" className="mb-2 block text-gray-700">Total Products</Label>
            <Input
              id="totalProducts"
              type="number"
              placeholder="Total Products"
              value={formData.totalProducts}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Product Details</h2>
          {formData.products.map((product, index) => (
            <div key={index} className="border p-6 rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-gray-700">Product #{index + 1}</h3>
                <Button
                  type="button"
                  onClick={() => removeProduct(index)}
                  variant="destructive"
                  className="px-4 py-2"
                >
                  Remove Product
                </Button>
              </div>
              <ProductForm
                index={index}
                product={product}
                handleProductChange={handleProductChange}
                sofaModels={initialSofaModels}
                bedModels={initialBedModels}
              />
            </div>
          ))}
        </div>

        {/* Submission Message */}
        {submissionMessage && (
          <div className={`p-4 rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {submissionMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button type="button" onClick={addProduct} className="px-6 py-3 text-lg">
            Add New Product
          </Button>
          <Button type="submit" className="px-6 py-3 text-lg bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Order'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderPageClient;