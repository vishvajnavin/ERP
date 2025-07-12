'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Product } from '@/types/products';
import { ExistingModel } from './product-form';
import { createClient } from '@/utils/supabase/client';
import { saveCustomProduct } from '@/actions/save-custom-product';

// Import the existing forms
import { BedDetailsForm } from './bed-details';
import { SofaDetailsForm } from './sofa-details';


interface ProductCustomizationFormProps {
  index: number;
  product: Product; // This `product` prop will hold the *edited* state
  handleProductChange: (
    index: number,
    field: keyof Product,
    value: string | number | boolean | undefined
  ) => void;
  sofaModels: ExistingModel[];
  bedModels: ExistingModel[];
}

export const ProductCustomizationForm: React.FC<ProductCustomizationFormProps> = ({
  index,
  product,
  handleProductChange, // The parent's handler
  sofaModels,
  bedModels,
}) => {
  const supabase = createClient();

  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBaseModelId, setSelectedBaseModelId] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Use a local state for the editable product details that this component manages
  const [editableProduct, setEditableProduct] = useState<Product>(product);

  // ✅ FIX: This effect now only runs when the product TYPE changes, which is the correct behavior.
  // It no longer resets the form after fetching details.
  useEffect(() => {
    // This effect runs when the parent's `product.product_type` prop changes.
    setEditableProduct(product);
    // When the product type changes, clear the selected base model for customization
    setSelectedBaseModelId(null);
    setSearchTerm('');
  },
  // eslint-disable-next-line
   [product.product_type]); // Changed dependency from `[product]` to `[product.product_type]`

  // Effect to pre-fill search term when a model is already selected
  useEffect(() => {
    if (product.product_type === 'sofa' && selectedBaseModelId) {
      const model = sofaModels.find(m => m.id === selectedBaseModelId);
      setSearchTerm(model ? model.model_name : '');
    } else if (product.product_type === 'bed' && selectedBaseModelId) {
      const model = bedModels.find(m => m.id === selectedBaseModelId);
      setSearchTerm(model ? model.model_name : '');
    } else {
      setSearchTerm(''); // Clear search term if no base model selected
    }
  }, [selectedBaseModelId, product.product_type, sofaModels, bedModels]);


  const fetchAndSetDetails = useCallback(async (modelId: string, type: 'sofa' | 'bed') => {
    setIsLoadingDetails(true);
    setErrorDetails(null);
    try {
      const tableName = type === 'sofa' ? 'sofa_products' : 'bed_products';
      const { data, error } = await supabase.from(tableName).select('*').eq('id', modelId).single();

      if (error) throw error;

      if (data) {
        const mappedData: Product = {
          product_type: type,
          is_existing_model: false,
          quantity: editableProduct.quantity || 1,
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
          customization: data.customization,
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
        
        setEditableProduct(mappedData);
        
        (Object.keys(mappedData) as (keyof Product)[]).forEach(key => {
          handleProductChange(index, key, mappedData[key]);
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error fetching model details for customization:", err.message);
        setErrorDetails(`Failed to load details for customization: ${err.message}`);
      } else {
        console.error("Error fetching model details for customization:", err);
        setErrorDetails("Failed to load details for customization: Unknown error");
      }
    } finally {
      setIsLoadingDetails(false);
    }
  }, [supabase, editableProduct.quantity, handleProductChange, index]);


  // Trigger fetch when selectedBaseModelId changes
  useEffect(() => {
    if (selectedBaseModelId && product.product_type) {
      fetchAndSetDetails(selectedBaseModelId, product.product_type);
    }
  }, [selectedBaseModelId, product.product_type, fetchAndSetDetails]);


  // Handler for changes within the editable form fields
  const handleEditableProductChange = (field: keyof Product, value: Product[keyof Product]) => {
    const newEditableProduct = { ...editableProduct, [field]: value };
    setEditableProduct(newEditableProduct);
    
    // Also update the parent's product state immediately for direct changes
    handleProductChange(index, field, value);
  };

  const handleSaveCustomModel = async () => {
    if (!editableProduct.model_name) {
      toast.error("Custom model must have a name.");
      return;
    }

    setIsSaving(true);
    try {
      const newModel: Omit<Product, 'id'> = {
        ...editableProduct,
        is_existing_model: false, 
        customization: true, 
        sofa_product_id: undefined,
        bed_product_id: undefined,
      };

      if (product.product_type !== 'sofa' && product.product_type !== 'bed') {
        throw new Error("Invalid product type for saving customization.");
      }
      const { data, error } = await saveCustomProduct(newModel);

      if (error) {
        throw new Error(error);
      }

      toast.success(`Customized model "${data.model_name}" saved!`)

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error saving customized model:", err.message);
        toast.error(`Failed to save custom model: ${err.message}`)
      } else {
        console.error("Error saving customized model:", err);
        toast.error("Failed to save custom model: Unknown error")
      }
    } finally {
      setIsSaving(false);
    }
  };

  const modelsToSearch = product.product_type === 'sofa' ? sofaModels : bedModels;

  return (
    <Card className="p-4 my-4">
      <h3 className="text-xl font-semibold mb-4">Customize Existing Model</h3>
      <div className="mb-4">
        <Label htmlFor={`base-model-search-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Base Model for Customization
        </Label>
        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCombobox}
              className="w-full justify-between"
            >
              {selectedBaseModelId
                ? modelsToSearch.find((model) => model.id === selectedBaseModelId)?.model_name
                : "Search for a model..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput
                placeholder="Search model by name or ID..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>No models found.</CommandEmpty>
                <CommandGroup>
                  {modelsToSearch
                    .filter(model =>
                      model.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      model.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((model) => (
                      <CommandItem
                        key={model.id}
                        value={model.model_name}
                        onSelect={() => {
                          setSelectedBaseModelId(model.id);
                          setOpenCombobox(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedBaseModelId === model.id ? "opacity-100" : "opacity-0"
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

      {isLoadingDetails && <p className="text-blue-600 mt-4">Loading model details for customization...</p>}
      {errorDetails && <p className="text-red-600 mt-4">Error: {errorDetails}</p>}

      {selectedBaseModelId && !isLoadingDetails && !errorDetails && (
        <div className="mt-6 p-4 border rounded-md bg-white space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Editable Details for Base Model: {modelsToSearch.find(m => m.id === selectedBaseModelId)?.model_name}
          </h4>
          <p className="text-sm text-gray-600">Modify the fields below to create a new customized model.</p>

          {editableProduct.product_type === 'sofa' && (
            <SofaDetailsForm
              index={index}
              product={editableProduct}
              handleProductChange={(_idx, field, value) => handleEditableProductChange(field, value)}
            />
          )}

          {editableProduct.product_type === 'bed' && (
            <BedDetailsForm
              index={index}
              product={editableProduct}
              handleProductChange={(_idx, field, value) => handleEditableProductChange(field, value)}
            />
          )}

          <Button
            onClick={handleSaveCustomModel}
            disabled={isSaving || isLoadingDetails || !selectedBaseModelId}
            className="mt-6 w-full"
          >
            {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Customized Model</>}
          </Button>
        </div>
      )}
    </Card>
  );
};