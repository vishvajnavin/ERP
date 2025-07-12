// components/product-form.tsx
'use client';

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label"; // Ensure this is the correct import for Label
// --- Shadcn/ui Combobox Primitives ---
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this path is correct and `cn` is available
// Import specific custom forms if you want to keep them separate from the display
import { BedDetailsForm } from "./bed-details";
import { SofaDetailsForm } from "./sofa-details";

// --- Supabase Client ---
import { createClient } from '@/utils/supabase/client'; // Import client-side Supabase utility

// --- Product Types and Display/Customization Components ---
import { Product } from "@/types/products"; // Ensure this Product type includes ALL possible sofa and bed fields
import { ProductDetailsDisplay } from "./product-details-display";

// Define a type for your existing models (updated to include 'customization')
export interface ExistingModel {
  id: string;
  model_name: string;
  customization?: boolean; // ✨ ADDED FIELD ✨
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
  const supabase = createClient();
  const [openSofaCombobox, setOpenSofaCombobox] = useState(false);
  const [openBedCombobox, setOpenBedCombobox] = useState(false);
  const [sofaSearchTerm, setSofaSearchTerm] = useState('');
  const [bedSearchTerm, setBedSearchTerm] = useState('');
  const [fetchedProductDetails, setFetchedProductDetails] = useState<Product | null>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [fetchDetailsError, setFetchDetailsError] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchDetails = async (modelId: string, type: 'sofa' | 'bed') => {
      setIsFetchingDetails(true);
      setFetchDetailsError(null);
      setFetchedProductDetails(null);

      try {
        const tableName = type === 'sofa' ? 'sofa_products' : 'bed_products';
        const { data, error } = await supabase.from(tableName).select('*').eq('id', modelId).single();
        if (error) throw error;

        if (data) {
          const mappedProduct: Product = {
            product_type: type,
            is_existing_model: product.is_existing_model,
            is_customization: product.is_customization,
            quantity: product.quantity,
            model_name: data.model_name,
            description: data.description,
            reference_image_url: data.reference_image_url,
            measurement_drawing_url: data.measurement_drawing_url,
            upholstery: data.upholstery,
            upholstery_color: data.upholstery_color,
            total_width: data.total_width,
            total_depth: data.total_depth,
            total_height: data.total_height,
            polish_color: data.polish_color,
            polish_finish: data.polish_finish,
            sofa_product_id: type === 'sofa' ? data.id : undefined,
            recliner_mechanism_mode: data.recliner_mechanism_mode,
            recliner_mechanism_flip: data.recliner_mechanism_flip,
            wood_to_floor: data.wood_to_floor,
            headrest_mode: data.headrest_mode,
            cup_holder: data.cup_holder,
            snack_swivel_tray: data.snack_swivel_tray,
            daybed_headrest_mode: data.daybed_headrest_mode,
            daybed_position: data.daybed_position,
            armrest_storage: data.armrest_storage,
            storage_side: data.storage_side,
            foam_density_seating: data.foam_density_seating,
            foam_density_backrest: data.foam_density_backrest,
            belt_details: data.belt_details,
            leg_type: data.leg_type,
            pvd_color: data.pvd_color,
            chester_option: data.chester_option,
            armrest_panels: data.armrest_panels,
            seat_width: data.seat_width,
            seat_depth: data.seat_depth,
            seat_height: data.seat_height,
            armrest_width: data.armrest_width,
            armrest_depth: data.armrest_depth,
            bed_product_id: type === 'bed' ? data.id : undefined,
            bed_size: data.bed_size,
            customized_mattress_size: data.customized_mattress_size,
            headboard_type: data.headboard_type,
            storage_option: data.storage_option,
            bed_portion: data.bed_portion,
          };

          if (product.is_customization) {
            Object.keys(mappedProduct).forEach(key => {
              handleProductChange(index, key as keyof Product, mappedProduct[key as keyof Product]);
            });
          } else {
            setFetchedProductDetails(mappedProduct);
          }
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Error fetching model details:", message);
        setFetchDetailsError(`Failed to load details: ${message}`);
      } finally {
        setIsFetchingDetails(false);
      }
    };

    if (selectedModelId) {
      fetchDetails(selectedModelId, product.product_type!);
    }
  }, [selectedModelId, product.product_type, product.is_existing_model, product.is_customization, supabase, index, product.quantity, handleProductChange]);

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

        {/* Existing Model, New Specification, or Customize Selection */}
        <Select
          value={
            product.is_customization
              ? "customize"
              : product.is_existing_model
              ? "true"
              : "false"
          }
          onValueChange={(val) => {
            if (val === "customize") {
              handleProductChange(index, "is_customization", true);
              handleProductChange(index, "is_existing_model", false);
            } else {
              handleProductChange(index, "is_customization", false);
              handleProductChange(index, "is_existing_model", val === "true");
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Product Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Existing Model</SelectItem>
            <SelectItem value="false">New Custom Specification</SelectItem>
            <SelectItem value="customize">Customize From Existing</SelectItem>
          </SelectContent>
        </Select>

        {/* Quantity Input */}
        <Input
          type="number"
          min={1}
          placeholder="Quantity"
          value={product.quantity || ''}
          onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
        />
      </div>

      {/* Conditional Rendering for Existing Model Selection (Combobox) */}
      {product.product_type === 'sofa' && (product.is_existing_model || product.is_customization) && (
        <div className="mt-4">
          <Label htmlFor={`existing-model-combobox-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Select Existing Model
          </Label>
          <Popover open={product.product_type === 'sofa' ? openSofaCombobox : openBedCombobox} onOpenChange={product.product_type === 'sofa' ? setOpenSofaCombobox : setOpenBedCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={product.product_type === 'sofa' ? openSofaCombobox : openBedCombobox}
                className="w-full justify-between"
              >
                {product.product_type === 'sofa'
                  ? (product.sofa_product_id
                    ? sofaModels.find((model) => model.id === product.sofa_product_id)?.model_name
                    : "Select Sofa Model...")
                  : (product.bed_product_id
                    ? bedModels.find((model) => model.id === product.bed_product_id)?.model_name
                    : "Select Bed Model...")}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput
                  placeholder={`Search ${product.product_type} model...`}
                  value={product.product_type === 'sofa' ? sofaSearchTerm : bedSearchTerm}
                  onValueChange={product.product_type === 'sofa' ? setSofaSearchTerm : setBedSearchTerm}
                />
                <CommandList>
                  <CommandEmpty>{`No ${product.product_type} models found.`}</CommandEmpty>
                  <CommandGroup>
                    {(product.product_type === 'sofa' ? sofaModels : bedModels)
                      .filter(model =>
                        model.model_name.toLowerCase().includes((product.product_type === 'sofa' ? sofaSearchTerm : bedSearchTerm).toLowerCase()) ||
                        model.id.toString().toLowerCase().includes((product.product_type === 'sofa' ? sofaSearchTerm : bedSearchTerm).toLowerCase())
                      )
                      .map((model) => (
                        <CommandItem
                          key={model.id}
                          value={model.model_name}
                          onSelect={() => {
                            setSelectedModelId(model.id);
                            handleProductChange(index, 'sofa_product_id', model.id);
                            setSofaSearchTerm(model.model_name);
                            setOpenSofaCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              (product.product_type === 'sofa' && product.sofa_product_id === model.id) ||
                              (product.product_type === 'bed' && product.bed_product_id === model.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.model_name}
                          {model.customization && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Customized
                            </span>
                          )}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {product.product_type === 'bed' && (product.is_existing_model || product.is_customization) && (
        <div className="mt-4">
          <Label htmlFor={`bed-model-combobox-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Select Existing Bed Model
          </Label>
          <Popover open={openBedCombobox} onOpenChange={setOpenBedCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openBedCombobox}
                className="w-full justify-between"
              >
                {product.bed_product_id
                  ? bedModels.find((model) => model.id === product.bed_product_id)?.model_name
                  : "Select Bed Model..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput
                  placeholder="Search bed model..."
                  value={bedSearchTerm}
                  onValueChange={setBedSearchTerm}
                />
                <CommandList>
                  <CommandEmpty>No bed models found.</CommandEmpty>
                  <CommandGroup>
                    {bedModels
                      .filter(model =>
                        model.model_name.toLowerCase().includes(bedSearchTerm.toLowerCase()) ||
                        model.id.toString().toLowerCase().includes(bedSearchTerm.toLowerCase())
                      )
                      .map((model) => (
                        <CommandItem
                          key={model.id}
                          value={model.model_name}
                          onSelect={() => {
                            setSelectedModelId(model.id);
                            handleProductChange(index, 'bed_product_id', model.id);
                            setBedSearchTerm(model.model_name);
                            setOpenBedCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              product.bed_product_id === model.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {model.model_name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Display fetched details for existing models */}
      {product.is_existing_model && (
        <>
          {isFetchingDetails && (
            <p className="text-blue-600 mt-4">Loading model details...</p>
          )}
          {fetchDetailsError && (
            <p className="text-red-600 mt-4">Error: {fetchDetailsError}</p>
          )}
          {fetchedProductDetails && !isFetchingDetails && !fetchDetailsError && (
            <ProductDetailsDisplay product={fetchedProductDetails} />
          )}
        </>
      )}

      {/* Conditional Rendering for Customization Form */}

      {/* Conditional Rendering for Custom Specification Details Forms */}
      {product.product_type === 'sofa' && (!product.is_existing_model || product.is_customization) && (
        <SofaDetailsForm
          index={index}
          product={product}
          handleProductChange={handleProductChange}
        />
      )}
      {product.product_type === 'bed' && (!product.is_existing_model || product.is_customization) && (
        <BedDetailsForm
          index={index}
          product={product}
          handleProductChange={handleProductChange}
        />
      )}
    </Card>
  );
};
