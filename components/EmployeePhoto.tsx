'use client';

import { useState } from 'react';
import { getImageDataUrl } from '@/lib/image-utils';

interface EmployeePhotoProps {
  photo: string | null;
  name: string;
  isImageData?: boolean; // If true, photo contains JSON image data, otherwise it's a URL/data URL
}

export default function EmployeePhoto({ photo, name, isImageData = false }: EmployeePhotoProps) {
  const [hasError, setHasError] = useState(false);

  // Convert image data to URL if needed
  const imageUrl = photo 
    ? (isImageData ? getImageDataUrl(photo) : photo)
    : null;

  if (!imageUrl || hasError) {
    return (
      <div className="w-full h-64 bg-gray-900 border-b-2 border-gray-900 flex items-center justify-center">
        <p className="text-gray-500">No Photo</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-gray-900 border-b-2 border-gray-900 overflow-hidden">
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
