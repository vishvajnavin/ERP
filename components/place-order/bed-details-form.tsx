import { InputField, ImageUploadField, TextAreaField, ToggleGroupField, ComboboxField } from "./product-fields";
import { DetailsFormProps } from "./product-fields";

export const BedDetailsForm: React.FC<DetailsFormProps> = ({ index, product, handleProductChange, disabled, baseName, nameError }) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField name={`${baseName}.model_name`} label="Model Name" value={product.model_name || ''} error={nameError} disabled={disabled} onChange={(e) => handleProductChange(index, "model_name", e.target.value)} />
            <ImageUploadField name={`${baseName}.reference_image_url`} label="Reference Image" value={product.reference_image_url} disabled={disabled} onChange={(file) => handleProductChange(index, "reference_image_url", file?.name)} />
            <ImageUploadField name={`${baseName}.measurement_drawing_url`} label="Measurement Drawing" value={product.measurement_drawing_url} disabled={disabled} onChange={(file) => handleProductChange(index, "measurement_drawing_url", file?.name)} />
            <TextAreaField name={`${baseName}.description`} label="Description" value={product.description || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "description", e.target.value)} />
            <ToggleGroupField name={`${baseName}.bed_size`} label="Bed Size" value={product.bed_size} disabled={disabled} onValueChange={(val) => handleProductChange(index, "bed_size", val)} options={[{value: 'king', label: 'King'}, {value: 'queen', label: 'Queen'}, {value: 'customized', label: 'Customized'}]} />
            {product.bed_size === "customized" && <InputField name={`${baseName}.customized_mattress_size`} label="Custom Mattress Size" value={product.customized_mattress_size || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "customized_mattress_size", e.target.value)} />}
            <ToggleGroupField name={`${baseName}.headboard_type`} label="Headboard Type" value={product.headboard_type} disabled={disabled} onValueChange={(val) => handleProductChange(index, "headboard_type", val)} options={[{value: 'medium_back_4ft', label: 'Medium Back 4ft'}, {value: 'high_back_4_5ft', label: 'High Back 4.5ft'}]} />
            <ToggleGroupField name={`${baseName}.storage_option`} label="Storage Option" value={product.storage_option} disabled={disabled} onValueChange={(val) => handleProductChange(index, "storage_option", val)} options={[{value: 'hydraulic', label: 'Hydraulic'}, {value: 'channel', label: 'Channel'}, {value: 'motorised', label: 'Motorised'}, {value: 'without_storage', label: 'Without Storage'}]} />
            <ToggleGroupField name={`${baseName}.bed_portion`} label="Bed Portion" value={product.bed_portion} disabled={disabled} onValueChange={(val) => handleProductChange(index, "bed_portion", val)} options={[{value: 'single', label: 'Single'}, {value: 'double', label: 'Double'}]} />
            <InputField name={`${baseName}.total_width`} label="Total Width (cm)" type="number" value={product.total_width || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "total_width", Number(e.target.value))} />
            <InputField name={`${baseName}.total_depth`} label="Total Depth (cm)" type="number" value={product.total_depth || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "total_depth", Number(e.target.value))} />
            <InputField name={`${baseName}.total_height`} label="Total Height (cm)" type="number" value={product.total_height || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "total_height", Number(e.target.value))} />
            <ComboboxField name={`${baseName}.upholstery`} label="Upholstery" placeholder="Select Upholstery" value={product.upholstery} disabled={disabled} onValueChange={(val) => handleProductChange(index, "upholstery", val)} options={[{value: 'fabric', label: 'Fabric'}, {value: 'pu', label: 'PU'}, {value: 'leather_bloom', label: 'Leather Bloom'}]} />
            <InputField name={`${baseName}.upholstery_color`} label="Upholstery Color" value={product.upholstery_color || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "upholstery_color", e.target.value)} />
            <InputField name={`${baseName}.polish_color`} label="Polish Color" value={product.polish_color || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "polish_color", e.target.value)} />
            <ToggleGroupField name={`${baseName}.polish_finish`} label="Polish Finish" value={product.polish_finish} disabled={disabled} onValueChange={(val) => handleProductChange(index, "polish_finish", val)} options={[{value: 'matt_finish', label: 'Matt Finish'}, {value: 'glossy_finish', label: 'Glossy Finish'}]} />
        </div>
    );
};
