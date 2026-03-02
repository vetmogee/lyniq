import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import ServiceGroupClient from '@/components/ServiceGroupClient';
import ServiceGroupSkeleton from '@/components/ServiceGroupSkeleton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services - Lyniq',
  description: 'Prozkoumejte náš komplexní sortiment profesionálních služeb péče o nehty',
};

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

/** Async server component that fetches and renders a single service group */
async function ServiceGroupSection({ groupId }: { groupId: string }) {
  const group = await prisma.serviceGroup.findUnique({
    where: { id: groupId },
    include: {
      services: {
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!group || group.services.length === 0) return null;

  const serialized = JSON.parse(JSON.stringify(group));
  return <ServiceGroupClient group={serialized} />;
}

/** Async server component that fetches and renders ungrouped services */
async function UngroupedServicesSection() {
  const ungroupedServices = await prisma.service.findMany({
    where: { serviceGroupId: null },
    orderBy: { position: 'asc' },
  });

  if (ungroupedServices.length === 0) return null;

  const serialized = JSON.parse(JSON.stringify(ungroupedServices));

  // Wrap ungrouped services as a virtual group for the client component
  const virtualGroup = {
    id: 'ungrouped',
    name: 'Další služby',
    description: null,
    position: 999,
    services: serialized,
  };

  return <ServiceGroupClient group={virtualGroup} label="Další služby" />;
}

export default async function ServicesPage() {
  // Lightweight query: only fetch group IDs and positions for the shell
  const groups = await prisma.serviceGroup.findMany({
    select: { id: true, position: true },
    orderBy: { position: 'asc' },
  });

  const hasGroups = groups.length > 0;
  // We also check for ungrouped services via its own Suspense boundary

  return (
    <div className="bg-[#202020]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 relative z-10">
            NAŠE SLUŽBY
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Prozkoumejte náš komplexní sortiment profesionálních služeb péče o nehty.
          </p>
        </div>

        <div className="space-y-12">
          {/* Each service group loads independently — first loaded = first rendered */}
          {groups.map((group) => (
            <Suspense key={group.id} fallback={<ServiceGroupSkeleton />}>
              <ServiceGroupSection groupId={group.id} />
            </Suspense>
          ))}

          {/* Ungrouped services also stream independently */}
          <Suspense fallback={<ServiceGroupSkeleton />}>
            <UngroupedServicesSection />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
