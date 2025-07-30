import React from 'react';

interface ProductDetailsProps {
  details: Record<string, unknown>;
  productType: 'Sofa' | 'Bed';
}

const formatLabel = (key: string) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ details, productType }) => {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-lg mb-2">{productType} Details</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="font-semibold text-gray-600">{formatLabel(key)}</span>
            <span>{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
