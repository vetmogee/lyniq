'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number | null;
  category: string | null;
  position: number;
}

// Helper function to format description with line breaks
function formatDescription(text: string) {
  const parts = text.split('/br');
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && <br />}
    </span>
  ));
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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Trigger animation after component mounts
    setMounted(true);
    // Initially all groups are collapsed
    setExpandedGroups(new Set());
  }, [serviceGroups, ungroupedServices]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const toggleService = (serviceId: string) => {
    setExpandedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  // Calculate global index for continuous animation
  let globalIndex = 0;

  return (
    <div className="space-y-12">
      {/* Service Groups */}
      {serviceGroups.map((group) => {
        const groupStartIndex = globalIndex;
        const isExpanded = expandedGroups.has(group.id);
        
        return (
          <div key={group.id} className="space-y-6">
            <div
              className="border-b-2 border-[#636362] pb-4 cursor-pointer hover:border-[#8a8a89] transition-colors"
              onClick={() => toggleGroup(group.id)}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
                transition: `opacity 0.6s ease-out ${groupStartIndex * 0.1}s, transform 0.6s ease-out ${groupStartIndex * 0.1}s`
              }}
            >
              <div className="flex items-center justify-center">
                <div className="flex-1 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{group.name}</h2>
                  {group.description && (
                    <p className="text-gray-400 mt-2">{formatDescription(group.description)}</p>
                  )}
                </div>
                <svg
                  className={`w-6 h-6 text-white transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {isExpanded && (
              <div className="grid grid-cols-1 gap-6">
                {group.services.map((service) => {
                  globalIndex++;
                  const isServiceExpanded = expandedServices.has(service.id);
                  const hasLongDescription = service.description && service.description.length > 150;
                  
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
                      <CardHeader className="text-center">
                        <CardTitle>{service.name}</CardTitle>
                        {service.category && (
                          <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                        )}
                      </CardHeader>
                      <CardContent className="text-center">
                        {service.description && (
                          <div className="mb-4">
                            <p className="text-gray-400">
                              {isServiceExpanded || !hasLongDescription
                                ? formatDescription(service.description)
                                : `${service.description.substring(0, 150)}...`}
                            </p>
                            {hasLongDescription && (
                              <button
                                onClick={() => toggleService(service.id)}
                                className="text-white hover:text-gray-300 text-sm mt-2 underline"
                              >
                                {isServiceExpanded ? 'zobrazit méně' : 'zobrazit více'}
                              </button>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-center pt-4 border-t-2 border-[#636362]">
                          <div>
                            <p className="text-2xl font-bold text-white">{service.price} Kč</p>
                            {service.duration && (
                              <p className="text-sm text-gray-400">{service.duration} minut</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Ungrouped Services */}
      {ungroupedServices.length > 0 && (
        <div className="space-y-6">
          <div
            className="border-b-2 border-[#636362] pb-4 cursor-pointer hover:border-[#8a8a89] transition-colors"
            onClick={() => toggleGroup('ungrouped')}
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
              transition: `opacity 0.6s ease-out ${globalIndex * 0.1}s, transform 0.6s ease-out ${globalIndex * 0.1}s`
            }}
          >
            <div className="flex items-center justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex-1 text-center">Další služby</h2>
              <svg
                className={`w-6 h-6 text-white transition-transform duration-300 flex-shrink-0 ${expandedGroups.has('ungrouped') ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {expandedGroups.has('ungrouped') && (
            <div className="grid grid-cols-1 gap-6">
              {ungroupedServices.map((service) => {
                globalIndex++;
                const isServiceExpanded = expandedServices.has(service.id);
                const hasLongDescription = service.description && service.description.length > 150;
                
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
                    <CardHeader className="text-center">
                      <CardTitle>{service.name}</CardTitle>
                      {service.category && (
                        <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                      )}
                    </CardHeader>
                    <CardContent className="text-center">
                      {service.description && (
                        <div className="mb-4">
                          <p className="text-gray-400">
                            {isServiceExpanded || !hasLongDescription
                              ? formatDescription(service.description)
                              : `${service.description.substring(0, 150)}...`}
                          </p>
                          {hasLongDescription && (
                            <button
                              onClick={() => toggleService(service.id)}
                              className="text-white hover:text-gray-300 text-sm mt-2 underline"
                            >
                              {isServiceExpanded ? 'zobrazit méně' : 'zobrazit více'}
                            </button>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-center pt-4 border-t-2 border-[#636362]">
                        <div>
                          <p className="text-2xl font-bold text-white">{service.price} Kč</p>
                          {service.duration && (
                            <p className="text-sm text-gray-400">{service.duration} minut</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
