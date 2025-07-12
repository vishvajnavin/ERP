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
import { ProductDetailsDisplay } from "./product-details-display"; // Component for displaying read-only details
import { ProductCustomizationForm } from "./product-customization-form"; // NEW Component for customization

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

// Define new option type for product state
type ProductSelectionMode = 'existing' | 'new' | 'customize';

export const ProductForm: React.FC<ProductFormProps> = ({
  index,
  product,
  handleProductChange,
  sofaModels,
  bedModels,
}) => {
  // Supabase Client instance
  const supabase = createClient();

  // State for managing the combobox open/closed state
  const [openSofaCombobox, setOpenSofaCombobox] = useState(false);
  const [openBedCombobox, setOpenBedCombobox] = useState(false);

  // State to manage the search input value within the combobox
  const [sofaSearchTerm, setSofaSearchTerm] = useState('');
  const [bedSearchTerm, setBedSearchTerm] = useState('');

  // State to store the *fetched* detailed product information for display (read-only)
  const [fetchedProductDetails, setFetchedProductDetails] = useState<Product | null>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [fetchDetailsError, setFetchDetailsError] = useState<string | null>(null);

  // State for the new selection mode
  const [selectionMode, setSelectionMode] = useState<ProductSelectionMode>(() => {
    if (product.is_existing_model) return 'existing';
    // If you need to infer 'customize' from `product` itself, you'd need a way to store that intent
    // For now, assuming if it's not existing and not a specific customization, it's 'new'
    return 'new';
  });

  // Effect to synchronize combobox display text with selected model
  // and trigger detail fetching for 'existing' mode
  useEffect(() => {
    // Reset fetched details and errors when product type or existing model status changes
    setFetchedProductDetails(null);
    setFetchDetailsError(null);

    const fetchDetails = async (modelId: string, type: 'sofa' | 'bed') => {
      setIsFetchingDetails(true);
      setFetchDetailsError(null);

      try {
        let tableName = '';
        if (type === 'sofa') {
          tableName = 'sofa_products'; // Replace with your actual sofa models table name
          setSofaSearchTerm(sofaModels.find(m => m.id === modelId)?.model_name || '');
        } else if (type === 'bed') {
          tableName = 'bed_products'; // Replace with your actual bed models table name
          setBedSearchTerm(bedModels.find(m => m.id === modelId)?.model_name || '');
        }

        const { data, error } = await supabase
          .from(tableName)
          .select('*') // Select all columns to get full details
          .eq('id', modelId)
          .single(); // Expecting a single record

        if (error) {
          throw error;
        }

        if (data) {
          // Map Supabase data to your Product interface
          const mappedProduct: Product = {
            product_type: type,
            is_existing_model: true, // This is for read-only display
            quantity: product.quantity,
            // Map common fields (adjust property names to match your DB schema)
            id: data.id, // Include ID if your Product interface has it
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
            customization: data.customization, // Carry over customization status

            // Sofa-specific fields (ensure they match your DB columns)
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
            // Bed-specific fields (ensure they match your DB columns)
            bed_product_id: type === 'bed' ? data.id : undefined,
            bed_size: data.bed_size,
            customized_mattress_size: data.customized_mattress_size,
            headboard_type: data.headboard_type,
            storage_option: data.storage_option,
            bed_portion: data.bed_portion,
          };
          setFetchedProductDetails(mappedProduct);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching model details:", err.message);
          setFetchDetailsError(`Failed to load details: ${err.message}`);
        } else {
          console.error("Error fetching model details:", err);
          setFetchDetailsError("Failed to load details: Unknown error");
        }
      } finally {
        setIsFetchingDetails(false);
      }
    };

    // Trigger fetch only if 'existing' mode and a model ID is selected for the current product type
    if (selectionMode === 'existing') {
      if (product.product_type === 'sofa' && product.sofa_product_id) {
        fetchDetails(product.sofa_product_id, 'sofa');
      } else if (product.product_type === 'bed' && product.bed_product_id) {
        fetchDetails(product.bed_product_id, 'bed');
      }
    }
  }, [product.sofa_product_id, product.bed_product_id, product.product_type, selectionMode, supabase, sofaModels, bedModels, product.quantity]);


  // Handler for selection mode change
  const handleSelectionModeChange = (val: string) => {
    const newMode = val as ProductSelectionMode;
    setSelectionMode(newMode);

    // Reset relevant product fields based on new mode
    handleProductChange(index, 'is_existing_model', newMode === 'existing'); // Only true for 'existing'
    handleProductChange(index, 'sofa_product_id', undefined);
    handleProductChange(index, 'bed_product_id', undefined);
    // Clear all custom fields if switching FROM 'customize' or 'new' TO 'existing'
    // Or if switching FROM 'existing' TO 'new'/'customize'
    if (newMode === 'existing') {
      // Clear custom fields but keep existing_model and sofa/bed IDs
      handleProductChange(index, 'model_name', undefined);
      handleProductChange(index, 'description', undefined);
      // ... clear all other custom fields as well
      // A more robust way might be to have a `resetProductCustomFields` helper
    } else if (newMode === 'new' || newMode === 'customize') {
      // For 'new' or 'customize', clear existing model IDs
      handleProductChange(index, 'sofa_product_id', undefined);
      handleProductChange(index, 'bed_product_id', undefined);
    }
  };


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

        {/* Existing Model / New Specification / Customize Existing Selection */}
        <Select
          value={selectionMode}
          onValueChange={handleSelectionModeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Product Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="existing">Existing Model (Read-Only)</SelectItem>
            <SelectItem value="new">New Custom Specification</SelectItem>
            <SelectItem value="customize">Existing Model Customisation</SelectItem>
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
      {product.product_type && selectionMode === 'existing' && (
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
                            if (product.product_type === 'sofa') {
                              handleProductChange(index, 'sofa_product_id', model.id);
                              setSofaSearchTerm(model.model_name);
                              setOpenSofaCombobox(false);
                            } else {
                              handleProductChange(index, 'bed_product_id', model.id);
                              setBedSearchTerm(model.model_name);
                              setOpenBedCombobox(false);
                            }
                            // Also clear specific custom fields when switching to an existing model
                            handleProductChange(index, 'model_name', undefined); // Important: Clear if coming from customize/new
                            handleProductChange(index, 'description', undefined); // Clear other custom fields
                            // You might need a more comprehensive reset of `product` here
                            // depending on how you manage its state across different modes.
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

      {/* Display fetched details for existing models (Read-Only) */}
      {product.product_type && selectionMode === 'existing' && (
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
      {product.product_type && selectionMode === 'customize' && (
        <ProductCustomizationForm
          index={index}
          product={product} // Pass the current product state for editing
          handleProductChange={handleProductChange}
          sofaModels={sofaModels}
          bedModels={bedModels}
        />
      )}

      {/* Conditional Rendering for New Custom Specification Details Forms */}
      {product.product_type === 'sofa' && selectionMode === 'new' && (
        <SofaDetailsForm
          index={index}
          product={product}
          handleProductChange={handleProductChange}
        />
      )}
      {product.product_type === 'bed' && selectionMode === 'new' && (
        <BedDetailsForm
          index={index}
          product={product}
          handleProductChange={handleProductChange}
        />
      )}
    </Card>
  );
};