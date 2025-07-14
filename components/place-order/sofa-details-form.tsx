import { DetailsFormProps, InputField, ImageUploadField, TextAreaField, ToggleGroupField, ComboboxField } from "./product-fields";
export const SofaDetailsForm: React.FC<DetailsFormProps> = ({ index, product, handleProductChange, disabled }) => {
    const upholsteryOptions = [
        {value: 'fabric', label: 'Fabric'}, {value: 'pu', label: 'PU'}, {value: 'leather_bloom', label: 'Leather Bloom'},
        {value: 'leather_floater', label: 'Leather Floater'}, {value: 'leather_floater_max', label: 'Leather Floater Max'},
        {value: 'leather_platinum_max', label: 'Leather Platinum Max'}, {value: 'leather_european_nappa', label: 'Leather European Nappa'},
        {value: 'leather_smoothy_nappa', label: 'Leather Smoothy Nappa'}, {value: 'pu_leather', label: 'PU Leather'}
    ];
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField label="Model Name" value={product.model_name || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "model_name", e.target.value)} />
            <ImageUploadField label="Reference Image" value={product.reference_image_url} disabled={disabled} onChange={(file) => handleProductChange(index, "reference_image_url", file?.name)} />
            <ImageUploadField label="Measurement Drawing" value={product.measurement_drawing_url} disabled={disabled} onChange={(file) => handleProductChange(index, "measurement_drawing_url", file?.name)} />
            <TextAreaField label="Description" value={product.description || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "description", e.target.value)} />
            <ToggleGroupField label="Recliner Mechanism" value={product.recliner_mechanism_mode} disabled={disabled} onValueChange={(val) => handleProductChange(index, "recliner_mechanism_mode", val)} options={[{value: 'manual', label: 'Manual'}, {value: 'motorized_single', label: 'Motorized Single'}, {value: 'motorized_double', label: 'Motorized Double'}]} />
            <ToggleGroupField label="Recliner Flip" value={product.recliner_mechanism_flip} disabled={disabled} onValueChange={(val) => handleProductChange(index, "recliner_mechanism_flip", val)} options={[{value: 'single_flip', label: 'Single Flip'}, {value: 'double_flip', label: 'Double Flip'}, {value: 'double_motor_with_headrest', label: 'Double Motor with Headrest'}]} />
            <ToggleGroupField label="Wood to Floor" value={product.wood_to_floor} disabled={disabled} onValueChange={(val) => handleProductChange(index, "wood_to_floor", val)} options={[{value: true, label: 'Wood'}, {value: false, label: 'Metal'}]} />
            <ToggleGroupField label="Headrest Mode" value={product.headrest_mode} disabled={disabled} onValueChange={(val) => handleProductChange(index, "headrest_mode", val)} options={[{value: 'manual', label: 'Manual'}, {value: 'motorized', label: 'Motorized'}]} />
            <ToggleGroupField label="Cup Holder" value={product.cup_holder} disabled={disabled} onValueChange={(val) => handleProductChange(index, "cup_holder", val)} options={[{value: 'normal_push_back', label: 'Normal Push Back'}, {value: 'chiller_cup', label: 'Chiller Cup'}]} />
            <ToggleGroupField label="Snack Swivel Tray" value={product.snack_swivel_tray} disabled={disabled} onValueChange={(val) => handleProductChange(index, "snack_swivel_tray", val)} options={[{value: true, label: 'Yes'}, {value: false, label: 'No'}]} />
            <ToggleGroupField label="Daybed Headrest" value={product.daybed_headrest_mode} disabled={disabled} onValueChange={(val) => handleProductChange(index, "daybed_headrest_mode", val)} options={[{value: 'manual', label: 'Manual'}, {value: 'motorized', label: 'Motorized'}]} />
            <ToggleGroupField label="Daybed Position" value={product.daybed_position} disabled={disabled} onValueChange={(val) => handleProductChange(index, "daybed_position", val)} options={[{value: 'rhs', label: 'RHS'}, {value: 'lhs', label: 'LHS'}]} />
            <ToggleGroupField label="Armrest Storage" value={product.armrest_storage} disabled={disabled} onValueChange={(val) => handleProductChange(index, "armrest_storage", val)} options={[{value: true, label: 'Yes'}, {value: false, label: 'No'}]} />
            <ToggleGroupField label="Storage Side" value={product.storage_side} disabled={disabled} onValueChange={(val) => handleProductChange(index, "storage_side", val)} options={[{value: 'rhs_arm', label: 'RHS Arm'}, {value: 'lhs_arm', label: 'LHS Arm'}, {value: 'both_arm', label: 'Both Arms'}]} />
            <InputField label="Foam Density (Seating)" type="number" value={product.foam_density_seating || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "foam_density_seating", Number(e.target.value))} />
            <InputField label="Foam Density (Backrest)" type="number" value={product.foam_density_backrest || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "foam_density_backrest", Number(e.target.value))} />
            <ToggleGroupField label="Belt Details" value={product.belt_details} disabled={disabled} onValueChange={(val) => handleProductChange(index, "belt_details", val)} options={[{value: 'elastic_belt', label: 'Elastic Belt'}, {value: 'zig_zag_spring', label: 'Zig Zag Spring'}, {value: 'pocket_spring', label: 'Pocket Spring'}]} />
            <ToggleGroupField label="Leg Type" value={product.leg_type} disabled={disabled} onValueChange={(val) => handleProductChange(index, "leg_type", val)} options={[{value: 'wood', label: 'Wood'}, {value: 'pvd', label: 'PVD'}, {value: 'ss', label: 'SS'}]} />
            <InputField label="PVD Color" value={product.pvd_color || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "pvd_color", e.target.value)} />
            <ToggleGroupField label="Chester Option" value={product.chester_option} disabled={disabled} onValueChange={(val) => handleProductChange(index, "chester_option", val)} options={[{value: 'with_button', label: 'With Button'}, {value: 'without_button', label: 'Without Button'}]} />
            <InputField label="Armrest Panels" value={product.armrest_panels || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "armrest_panels", e.target.value)} />
            <InputField label="Polish Color" value={product.polish_color || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "polish_color", e.target.value)} />
            <ToggleGroupField label="Polish Finish" value={product.polish_finish} disabled={disabled} onValueChange={(val) => handleProductChange(index, "polish_finish", val)} options={[{value: 'matt_finish', label: 'Matt Finish'}, {value: 'glossy_finish', label: 'Glossy Finish'}]} />
            <InputField label="Total Width (cm)" type="number" value={product.total_width || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "total_width", Number(e.target.value))} />
            <InputField label="Total Depth (cm)" type="number" value={product.total_depth || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "total_depth", Number(e.target.value))} />
            <InputField label="Total Height (cm)" type="number" value={product.total_height || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "total_height", Number(e.target.value))} />
            <InputField label="Seat Width (cm)" type="number" value={product.seat_width || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "seat_width", Number(e.target.value))} />
            <InputField label="Seat Depth (cm)" type="number" value={product.seat_depth || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "seat_depth", Number(e.target.value))} />
            <InputField label="Seat Height (cm)" type="number" value={product.seat_height || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "seat_height", Number(e.target.value))} />
            <InputField label="Armrest Width (cm)" type="number" value={product.armrest_width || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "armrest_width", Number(e.target.value))} />
            <InputField label="Armrest Depth (cm)" type="number" value={product.armrest_depth || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "armrest_depth", Number(e.target.value))} />
            <ComboboxField label="Upholstery" placeholder="Select Upholstery" value={product.upholstery} disabled={disabled} onValueChange={(val) => handleProductChange(index, "upholstery", val)} options={upholsteryOptions} />
            <InputField label="Upholstery Color" value={product.upholstery_color || ''} disabled={disabled} onChange={(e) => handleProductChange(index, "upholstery_color", e.target.value)} />
        </div>
    );
};