import { notFound } from 'next/navigation';
import ImageGroupGallery from '@/components/ImageGroupGallery';
import { getGalleryGroup } from '@/lib/content';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: PageProps<'/[locale]/gallery/[imageGroupId]'>): Promise<Metadata> {
  const { locale, imageGroupId } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const imageGroup = getGalleryGroup(imageGroupId);

  if (!imageGroup) {
    return {
      title: t('galleryTitle'),
    };
  }

  return {
    title: `${imageGroup.name} - Lyniq`,
    description: t('galleryGroupDescription', { name: imageGroup.name }),
  };
}

export default async function ImageGroupPage({ params }: PageProps<'/[locale]/gallery/[imageGroupId]'>) {
  const { locale, imageGroupId } = await params;
  setRequestLocale(locale);

  const imageGroup = getGalleryGroup(imageGroupId);

  // If group doesn't exist, show 404
  if (!imageGroup) {
    notFound();
  }

  return <ImageGroupGallery imageGroup={imageGroup} />;
}
