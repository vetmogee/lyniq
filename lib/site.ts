import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';

/** Public origin of the site, used for canonical URLs, sitemap and Open Graph. Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://lyniq.cz').replace(/\/$/, '');

export const SITE_NAME = 'Lyniq Studio';

export const OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Lyniq Studio',
};

const OG_LOCALES: Record<Locale, string> = {
  cs: 'cs_CZ',
  en: 'en_US',
  de: 'de_DE',
};

/** Path for a locale under the "as-needed" prefix strategy: /services (cs), /en/services */
export function localizedPath(locale: string, path = ''): string {
  if (locale === routing.defaultLocale) {
    return path || '/';
  }
  return `/${locale}${path}`;
}

/** Locale offered to visitors whose language isn't one of ours (hreflang x-default) */
const FALLBACK_LOCALE: Locale = 'en';

/** hreflang map for every locale, plus x-default pointing at the fallback locale */
export function languageAlternates(path = ''): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localizedPath(locale, path);
  }
  languages['x-default'] = localizedPath(FALLBACK_LOCALE, path);
  return languages;
}

/**
 * Full per-page metadata: canonical + hreflang alternates, Open Graph and Twitter card.
 * Pages must return the whole openGraph object, since Next.js replaces (not merges) it per segment.
 */
export function pageMetadata({
  locale,
  path = '',
  title,
  description,
  images,
}: {
  locale: string;
  path?: string;
  title: string;
  description?: string;
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
}): Metadata {
  const url = localizedPath(locale, path);
  const ogImages = images && images.length > 0 ? images : [OG_IMAGE];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES.cs,
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((image) => image.url),
    },
  };
}
