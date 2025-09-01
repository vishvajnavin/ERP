'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSignedUrl } from '@/actions/get-signed-url';

interface ImageViewerProps {
  label: string;
  imageUrl: string | null;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ label, imageUrl }) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);
      getSignedUrl(imageUrl)
        .then(url => {
          setSignedUrl(url);
        })
        .catch(error => {
          console.error(`Failed to get signed URL for ${label}:`, error);
          setSignedUrl(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSignedUrl(null);
    }
  }, [imageUrl, label]);

  return (
    <div className="flex flex-col col-span-2">
      <span className="font-semibold text-gray-600">{label}</span>
      <div className="mt-1 p-2 border rounded-lg h-48 flex items-center justify-center bg-gray-50">
        {isLoading ? (
          <p className="text-gray-500">Loading image...</p>
        ) : signedUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={signedUrl}
              alt={label}
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>
        ) : (
          <p className="text-gray-500">No image uploaded</p>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
