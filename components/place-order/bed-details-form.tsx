import { InputField, ImageUploadField, TextAreaField, ToggleGroupField, ComboboxField } from "./product-fields";
import { DetailsFormProps } from "./product-fields";

export const BedDetailsForm: React.FC<DetailsFormProps> = ({ index, product, handleProductChange, disabled }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Model Name" value={product.model_name || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "model_name", e.target.value)} />
            <ImageUploadField label="Reference Image" value={product.reference_image_url} disabled={disabled} onChange={(file) => handleProductChange(index, "reference_image_url", file?.name)} />
            <ImageUploadField label="Measurement Drawing" value={product.measurement_drawing_url} disabled={disabled} onChange={(file) => handleProductChange(index, "measurement_drawing_url", file?.name)} />
            <TextAreaField label="Description" value={product.description || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "description", e.target.value)} />
            <ToggleGroupField label="Bed Size" value={product.bed_size} disabled={disabled} onValueChange={(val) => handleProductChange(index, "bed_size", val)} options={[{value: 'king', label: 'King'}, {value: 'queen', label: 'Queen'}, {value: 'customized', label: 'Customized'}]} />
            {product.bed_size === "customized" && <InputField label="Custom Mattress Size" value={product.customized_mattress_size || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "customized_mattress_size", e.target.value)} />}
            <ToggleGroupField label="Headboard Type" value={product.headboard_type} disabled={disabled} onValueChange={(val) => handleProductChange(index, "headboard_type", val)} options={[{value: 'medium_back_4ft', label: 'Medium Back 4ft'}, {value: 'high_back_4_5ft', label: 'High Back 4.5ft'}]} />
            <ToggleGroupField label="Storage Option" value={product.storage_option} disabled={disabled} onValueChange={(val) => handleProductChange(index, "storage_option", val)} options={[{value: 'hydraulic', label: 'Hydraulic'}, {value: 'channel', label: 'Channel'}, {value: 'motorised', label: 'Motorised'}, {value: 'without_storage', label: 'Without Storage'}]} />
            <ToggleGroupField label="Bed Portion" value={product.bed_portion} disabled={disabled} onValueChange={(val) => handleProductChange(index, "bed_portion", val)} options={[{value: 'single', label: 'Single'}, {value: 'double', label: 'Double'}]} />
            <InputField label="Total Width (cm)" type="number" value={product.total_width || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "total_width", Number(e.target.value))} />
            <InputField label="Total Depth (cm)" type="number" value={product.total_depth || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "total_depth", Number(e.target.value))} />
            <InputField label="Total Height (cm)" type="number" value={product.total_height || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "total_height", Number(e.target.value))} />
            <ComboboxField label="Upholstery" placeholder="Select Upholstery" value={product.upholstery} disabled={disabled} onValueChange={(val) => handleProductChange(index, "upholstery", val)} options={[{value: 'fabric', label: 'Fabric'}, {value: 'pu', label: 'PU'}, {value: 'leather_bloom', label: 'Leather Bloom'}]} />
            <InputField label="Upholstery Color" value={product.upholstery_color || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "upholstery_color", e.target.value)} />
            <InputField label="Polish Color" value={product.polish_color || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "polish_color", e.target.value)} />
            <ToggleGroupField label="Polish Finish" value={product.polish_finish} disabled={disabled} onValueChange={(val) => handleProductChange(index, "polish_finish", val)} options={[{value: 'matt_finish', label: 'Matt Finish'}, {value: 'glossy_finish', label: 'Glossy Finish'}]} />
        </div>
    );
};