'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  from: boolean;
  duration: number | null;
  category: string | null;
  position: number;
}

function formatDescription(text: string) {
  const parts = text.split(/\n|\/br/);
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

interface ServiceGroupClientProps {
  group: ServiceGroup;
  label?: string;
}

export default function ServiceGroupClient({ group, label }: ServiceGroupClientProps) {
  const t = useTranslations('Services');
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const groupName = label ?? group.name;

  return (
    <div className="space-y-6">
      <div
        className="border-b-2 border-[#636362] pb-4 cursor-pointer hover:border-[#8a8a89] transition-colors"
        onClick={() => setExpanded(prev => !prev)}
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        <div className="flex items-center justify-center">
          <div className="flex-1 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">{groupName}</h2>
            {group.description && (
              <p className="text-gray-400 mt-2">{formatDescription(group.description)}</p>
            )}
          </div>
          <svg
            className={`w-6 h-6 text-white transition-transform duration-300 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 gap-6">
          {group.services.map((service, idx) => {
            const isServiceExpanded = expandedServices.has(service.id);
            const hasLongDescription = service.description && service.description.length > 150;

            return (
              <Card
                key={service.id}
                variant="bordered"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
                  transition: `opacity 0.6s ease-out ${(idx + 1) * 0.1}s, transform 0.6s ease-out ${(idx + 1) * 0.1}s`,
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
                          {isServiceExpanded ? t('showLess') : t('showMore')}
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-center pt-4 border-t-2 border-[#636362]">
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {t('price', { from: String(service.from), price: service.price })}
                      </p>
                      {service.duration && (
                        <p className="text-sm text-gray-400">{t('duration', { minutes: service.duration })}</p>
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
}
