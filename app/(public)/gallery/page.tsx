import { prisma } from '@/lib/prisma';
import Gallery from '@/components/Gallery';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery - Lyniq',
  description: 'Prozkoumejte naše portfolio nehtového designu a umění',
};

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  // Fetch all image groups with their images, ordered by creation date and image order
  const imageGroups = await prisma.imageGroup.findMany({
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <Gallery imageGroups={imageGroups} />;
}
