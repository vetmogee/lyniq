import { prisma } from '@/lib/prisma';
import ServicesAdminClient from '@/components/admin/ServicesAdminClient';

export default async function AdminServicesPage() {
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

  return (
    <ServicesAdminClient 
      serviceGroups={serviceGroups} 
      ungroupedServices={ungroupedServices}
    />
  );
}
