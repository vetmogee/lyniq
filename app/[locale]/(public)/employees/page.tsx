import EmployeeCards from '@/components/EmployeeCards';
import { getEmployees } from '@/lib/content';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: PageProps<'/[locale]/employees'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('employeesTitle'),
    description: t('employeesDescription'),
  };
}

export default async function EmployeesPage({ params }: PageProps<'/[locale]/employees'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Employees');

  const employees = getEmployees();

  return (
    <div className="bg-[#202020]">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 relative z-10">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {employees.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">{t('empty')}</p>
          </div>
        ) : (
          <EmployeeCards employees={employees} />
        )}
      </section>
    </div>
  );
}
