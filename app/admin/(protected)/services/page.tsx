import { prisma } from '@/lib/prisma';
import ServicesAdminClient from '@/components/admin/ServicesAdminClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services Admin - Lyniq',
  description: 'Manage services and service groups',
};

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

  // Serialize for client - Prisma Date objects are not RSC-serializable
  const serializedGroups = JSON.parse(JSON.stringify(serviceGroups));
  const serializedUngrouped = JSON.parse(JSON.stringify(ungroupedServices));

  return (
    <ServicesAdminClient 
      serviceGroups={serializedGroups} 
      ungroupedServices={serializedUngrouped}
    />
  );
}
