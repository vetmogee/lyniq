'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardTitle } from '@/components/ui/Card';
import type { Employee } from '@/lib/content';

interface EmployeeCardsProps {
  employees: Employee[];
}

function EmployeePhoto({ image, name }: { image: string | null; name: string }) {
  const [hasError, setHasError] = useState(false);

  if (!image || hasError) {
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
    <div className="w-full aspect-square bg-[#636362] overflow-hidden relative">
      <Image
        src={image}
        alt={name}
        fill
        sizes="320px"
        className="object-cover"
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
      {employees.map((employee, index) => (
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
              <EmployeePhoto image={employee.image} name={employee.name} />
            </div>
            <div className="p-6 flex flex-col items-center text-center">
              <CardTitle className="text-xl mb-2">{employee.name}</CardTitle>
              {employee.specialties.length > 0 && (
                <p className="text-sm text-gray-400">{employee.specialties.join(' · ')}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
