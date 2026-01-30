import { prisma } from '@/lib/prisma';
import Gallery from '@/components/Gallery';

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
