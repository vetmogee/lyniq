'use client';

import { useState, useEffect } from 'react';
import { Card, CardTitle } from '@/components/ui/Card';
import { getImageDataUrl } from '@/lib/image-utils';

interface Employee {
  id: string;
  name: string;
  title: string | null;
  description: string | null;
  photo: string | null;
  images: Array<{
    data: string;
  }>;
}

interface EmployeeCardsProps {
  employees: Employee[];
}

function EmployeePhoto({ photo, name, isImageData = false }: { photo: string | null; name: string; isImageData?: boolean }) {
  const [hasError, setHasError] = useState(false);

  // Convert image data to URL if needed
  const imageUrl = photo 
    ? (isImageData ? getImageDataUrl(photo) : photo)
    : null;

  if (!imageUrl || hasError) {
    // Get the first letter of the name
    const initial = name.charAt(0).toUpperCase();
    
    return (
      <div className="w-full aspect-square bg-[#636362] flex items-center justify-center">
        <span className="font-mono text-white text-4xl font-bold">
          {initial}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full aspect-square bg-[#636362] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function EmployeeCards({ employees }: EmployeeCardsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setMounted(true);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      {employees.map((employee, index) => {
        // Get photo from Image relation or fallback to photo field (backward compatibility)
        const employeeImage = employee.images && employee.images.length > 0 
          ? employee.images[0] 
          : null;
        const photoUrl = employeeImage 
          ? employeeImage.data 
          : employee.photo;
        
        return (
          <Card 
            key={employee.id} 
            variant="bordered" 
            className="w-80 overflow-hidden"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(-30px)',
              transition: `opacity 0.6s ease-out ${index * 0.5}s, transform 0.6s ease-out ${index * 0.5}s`
            }}
          >
            <div className="flex flex-col">
              <div className="w-80 h-80">
                <EmployeePhoto photo={photoUrl} name={employee.name} isImageData={!!employeeImage} />
              </div>
              <div className="p-6 flex flex-col items-center text-center">
                <CardTitle className="text-xl mb-2">{employee.name}</CardTitle>
                {employee.title && (
                  <p className="text-sm text-gray-400 mb-3">{employee.title}</p>
                )}
                {employee.description && (
                  <p className="text-gray-400">{employee.description}</p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
