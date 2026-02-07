import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ImageGroupGallery from '@/components/ImageGroupGallery';
import { Metadata } from 'next';

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ imageGroupId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { imageGroupId } = await params;
  
  const imageGroup = await prisma.imageGroup.findUnique({
    where: { id: imageGroupId },
    select: { name: true },
  });

  if (!imageGroup) {
    return {
      title: 'Gallery - Lyniq',
    };
  }

  return {
    title: `${imageGroup.name} - Lyniq`,
    description: `Prohlédněte si naše ${imageGroup.name} portfolio`,
  };
}

export default async function ImageGroupPage({ params }: PageProps) {
  // Await params (Next.js 15+)
  const { imageGroupId } = await params;

  // Fetch the specific image group with its images
  const imageGroup = await prisma.imageGroup.findUnique({
    where: { id: imageGroupId },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  // If group doesn't exist, show 404
  if (!imageGroup) {
    notFound();
  }

  return <ImageGroupGallery imageGroup={imageGroup} />;
}
