import { prisma } from '@/lib/prisma';
import GalleryAdminClient from '@/components/admin/GalleryAdminClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery Admin - Lyniq',
  description: 'Manage gallery images and groups',
};

export default async function AdminGalleryPage() {
  const imageGroups = await prisma.imageGroup.findMany({
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const serializedImageGroups = imageGroups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    images: group.images.map((image) => ({
      id: image.id,
      data: image.data,
      mimeType: image.mimeType,
      filename: image.filename,
      title: image.title,
      description: image.description,
      order: image.order,
    })),
  }));

  return <GalleryAdminClient imageGroups={serializedImageGroups} />;
}
