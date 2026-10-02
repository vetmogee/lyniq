import Gallery from '@/components/Gallery';
import { getGalleryGroups } from '@/lib/content';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: PageProps<'/[locale]/gallery'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('galleryTitle'),
    description: t('galleryDescription'),
  };
}

export default async function GalleryPage({ params }: PageProps<'/[locale]/gallery'>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Gallery imageGroups={getGalleryGroups()} />;
}
