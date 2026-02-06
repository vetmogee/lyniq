import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Image from 'next/image';

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
          <Image
            src="/lyniq.svg"
            alt=""
            width={200}
            height={200}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 opacity-40 pointer-events-none"
            style={{ transform: 'translate(calc(-50% + 4rem), calc(-50% - 3rem))' }}
            aria-hidden="true"
          />
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
          <div className="space-y-12">
            {/* Service Groups */}
            {filteredServiceGroups.map((group) => (
              <div key={group.id} className="space-y-6">
                <div className="border-b-2 border-[#636362] pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{group.name}</h2>
                  {group.description && (
                    <p className="text-gray-400 mt-2">{group.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.services.map((service) => (
                    <Card key={service.id} variant="bordered">
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
                  ))}
                </div>
              </div>
            ))}

            {/* Ungrouped Services */}
            {ungroupedServices.length > 0 && (
              <div className="space-y-6">
                <div className="border-b-2 border-[#636362] pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Další služby</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ungroupedServices.map((service) => (
                    <Card key={service.id} variant="bordered">
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
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
