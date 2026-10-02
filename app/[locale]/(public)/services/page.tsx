import ServiceGroupClient from '@/components/ServiceGroupClient';
import { getServiceGroups } from '@/lib/content';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: PageProps<'/[locale]/services'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('servicesTitle'),
    description: t('servicesDescription'),
  };
}

export default async function ServicesPage({ params }: PageProps<'/[locale]/services'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Services');

  const groups = getServiceGroups().filter((group) => group.services.length > 0);

  return (
    <div className="bg-[#202020]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 relative z-10">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-12">
          {groups.map((group) => (
            <ServiceGroupClient key={group.id} group={group} />
          ))}
        </div>
      </section>
    </div>
  );
}
