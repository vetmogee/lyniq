'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher({ onSelect }: { onSelect?: () => void }) {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex justify-center items-center gap-2" role="group" aria-label={t('language')}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          onClick={onSelect}
          aria-current={l === locale ? 'true' : undefined}
          className={`
            px-3 py-1 text-sm font-medium uppercase transition-colors duration-300
            ${l === locale
              ? 'text-white border-b-2 border-[#677075]'
              : 'text-gray-400 hover:text-white'
            }
          `}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
