'use client';
import React, { useState, useEffect, useRef } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Textarea } from "@/components/ui/textarea"; // Assuming path is correct
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, UploadCloud, X} from 'lucide-react'
import { cn } from "@/lib/utils";
import { Product } from "@/types/products";

// --- Detailed Forms ---
export interface DetailsFormProps {
  baseName: string;
  index: number;
  product: Product;
  handleProductChange: <K extends keyof Product>(index: number, field: K, value: Product[K]) => void;
  disabled: boolean;
}

export const InputField = ({ label, name, ...props }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input name={name} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 disabled:bg-gray-200 disabled:cursor-not-allowed" />
    </div>
);

type ToggleOption<T extends string | boolean> = {
    value: T;
    label: string;
};

export const ToggleGroupField = <T extends string | boolean>({ label, name, value, onValueChange, disabled, options }: { label: string; name: string; value: T | undefined; onValueChange: (value: T) => void; disabled: boolean; options: ToggleOption<T>[]}) => (
    <div>
        {/* Hidden input holds the name and value for the form submission */}
        <input type="hidden" name={name} value={String(value ?? '')} />
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {options.map(option => (
                <button type="button" key={String(option.value)} onClick={() => !disabled && onValueChange(option.value)} disabled={disabled} className={`flex-1 text-sm text-center py-2 px-2 rounded-md transition-all duration-200 ${value === option.value ? 'bg-white shadow font-semibold text-gray-800' : 'bg-transparent text-gray-600 hover:bg-gray-200'} disabled:cursor-not-allowed`}>{option.label}</button>
            ))}
        </div>
    </div>
);

export const ComboboxField = ({ label, name, value, onValueChange, disabled, options, placeholder }: { label: string; name: string; value: string | undefined; onValueChange: (value: string) => void; disabled: boolean; options: {value: string, label: string}[]; placeholder: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            {/* Hidden input holds the name and value for the form submission */}
            <input type="hidden" name={name} value={value ?? ''} />
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button type="button" variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed" disabled={disabled}>
                        {value ? options.find((option) => option.value === value)?.label : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command><CommandInput placeholder="Search..." /><CommandList><CommandEmpty>No option found.</CommandEmpty><CommandGroup>
                    {options.map((option) => (<CommandItem key={option.value} value={option.label} onSelect={() => { onValueChange(option.value); setOpen(false); }}>
                        <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />{option.label}
                    </CommandItem>))}
                </CommandGroup></CommandList></Command></PopoverContent>
            </Popover>
        </div>
    );
};

export const TextAreaField = ({ label, name, ...props }: { label: string; name: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <div className="md:col-span-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <Textarea name={name} {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 disabled:bg-gray-200 disabled:cursor-not-allowed" />
    </div>
);

export const ImageUploadField = ({ label, name, value, onChange, disabled }: { label: string; name: string; value?: File | string | null; onChange: (file: File | null) => void; disabled: boolean }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (typeof value === 'string') {
            setPreview(value);
        } else if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [value]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onChange(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        if(inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div onClick={() => !disabled && inputRef.current?.click()} className={cn("w-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 transition-colors", disabled ? "bg-gray-200 cursor-not-allowed" : "border-gray-300 hover:border-red-400 hover:bg-red-50 cursor-pointer")}>
                <input type="file" name={name} accept="image/*" ref={inputRef} onChange={handleFileChange} className="hidden" disabled={disabled} />
                {preview ? (
                    <div className="relative w-full h-48">
                        <Image src={preview} alt="Preview" layout="fill" objectFit="contain" className="rounded-md" />
                        {!disabled && <button type="button" onClick={handleRemove} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-600 hover:text-red-600"><X size={16} /></button>}
                    </div>
                ) : (
                    <>
                        <UploadCloud size={32} className="mb-2" />
                        <span>Click to upload an image</span>
                        <span className="text-xs">PNG, JPG, GIF up to 10MB</span>
                    </>
                )}
            </div>
        </div>
    );
};