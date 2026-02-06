'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string | null;
  position: number;
}

interface ServiceGroup {
  id: string;
  name: string;
  description: string | null;
  position: number;
  services: Service[];
}

interface ServiceCardsProps {
  serviceGroups: ServiceGroup[];
  ungroupedServices: Service[];
}

export default function ServiceCards({ serviceGroups, ungroupedServices }: ServiceCardsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setMounted(true);
  }, []);

  // Calculate global index for continuous animation
  let globalIndex = 0;

  return (
    <div className="space-y-12">
      {/* Service Groups */}
      {serviceGroups.map((group) => {
        const groupStartIndex = globalIndex;
        return (
          <div key={group.id} className="space-y-6">
            <div
              className="border-b-2 border-[#636362] pb-4"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
                transition: `opacity 0.6s ease-out ${groupStartIndex * 0.1}s, transform 0.6s ease-out ${groupStartIndex * 0.1}s`
              }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white">{group.name}</h2>
              {group.description && (
                <p className="text-gray-400 mt-2">{group.description}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.services.map((service) => {
                globalIndex++;
                return (
                  <Card
                    key={service.id}
                    variant="bordered"
                    style={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
                      transition: `opacity 0.6s ease-out ${globalIndex * 0.1}s, transform 0.6s ease-out ${globalIndex * 0.1}s`
                    }}
                  >
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                      {service.category && (
                        <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      {service.description && (
                        <p className="text-gray-400 mb-4">{service.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t-2 border-[#636362]">
                        <div>
                          <p className="text-2xl font-bold text-white">{service.price} Kč</p>
                          <p className="text-sm text-gray-400">{service.duration} minut</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Ungrouped Services */}
      {ungroupedServices.length > 0 && (
        <div className="space-y-6">
          <div
            className="border-b-2 border-[#636362] pb-4"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
              transition: `opacity 0.6s ease-out ${globalIndex * 0.1}s, transform 0.6s ease-out ${globalIndex * 0.1}s`
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">Další služby</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ungroupedServices.map((service) => {
              globalIndex++;
              return (
                <Card
                  key={service.id}
                  variant="bordered"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
                    transition: `opacity 0.6s ease-out ${globalIndex * 0.1}s, transform 0.6s ease-out ${globalIndex * 0.1}s`
                  }}
                >
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    {service.category && (
                      <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {service.description && (
                      <p className="text-gray-400 mb-4">{service.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-[#636362]">
                      <div>
                        <p className="text-2xl font-bold text-white">{service.price} Kč</p>
                        <p className="text-sm text-gray-400">{service.duration} minut</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
