import React from 'react';
import { formatReadableDate } from '@/lib/utils';
import ImageViewer from './ImageViewer';

interface ProductDetailsProps {
  details: Record<string, unknown>;
  productType: 'sofa' | 'bed';
}

const formatLabel = (key: string) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ details, productType }) => {
  const isDateKey = (key: string) => key.toLowerCase().includes('date') || key.toLowerCase().includes('at');
  const isImageUrlKey = (key: string) => key === 'reference_image_url' || key === 'measurement_drawing_url';

  const imageDetails = Object.entries(details).filter(([key]) => isImageUrlKey(key));
  const otherDetails = Object.entries(details).filter(([key]) => !isImageUrlKey(key));

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-lg mb-2">{productType} Details</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {otherDetails.map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="font-semibold text-gray-600">{formatLabel(key)}</span>
            <span>
              {isDateKey(key) && typeof value === 'string'
                ? formatReadableDate(value)
                : typeof value === 'string'
                ? formatLabel(value)
                : String(value)}
            </span>
          </div>
        ))}
        {imageDetails.map(([key, value]) => (
          <ImageViewer key={key} label={formatLabel(key)} imageUrl={value as string | null} />
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
