import { prisma } from '@/lib/prisma';
import ServiceCards from '@/components/ServiceCards';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services - Lyniq',
  description: 'Prozkoumejte náš komplexní sortiment profesionálních služeb péče o nehty',
};

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  // Fetch service groups with their services
  const serviceGroups = await prisma.serviceGroup.findMany({
    include: {
      services: {
        orderBy: { position: 'asc' },
      },
    },
    orderBy: { position: 'asc' },
  });

  // Also get ungrouped services (for backward compatibility)
  const ungroupedServices = await prisma.service.findMany({
    where: {
      serviceGroupId: null,
    },
    orderBy: { position: 'asc' },
  });

  // Filter to only groups with active services
  const filteredServiceGroups = serviceGroups.filter(group => group.services.length > 0);
  const hasServices = filteredServiceGroups.length > 0 || ungroupedServices.length > 0;

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

        {!hasServices ? (
          <div className="text-center py-12">
            <p className="text-gray-400">V tuto chvíli nejsou k dispozici žádné služby.</p>
          </div>
        ) : (
          <ServiceCards 
            serviceGroups={filteredServiceGroups} 
            ungroupedServices={ungroupedServices}
          />
        )}
      </section>
    </div>
  );
}
