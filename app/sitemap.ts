import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getGalleryGroups } from '@/lib/content';
import { SITE_URL, languageAlternates, localizedPath } from '@/lib/site';

const STATIC_PATHS: Array<{ path: string; priority: number }> = [
  { path: '', priority: 1 },
  { path: '/services', priority: 0.9 },
  { path: '/gallery', priority: 0.8 },
  { path: '/employees', priority: 0.7 },
  { path: '/contact', priority: 0.8 },
];

function absolute(languages: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(languages).map(([lang, path]) => [lang, `${SITE_URL}${path}`]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const galleryPaths = getGalleryGroups().map((group) => ({ path: `/gallery/${group.id}`, priority: 0.6 }));
  const lastModified = new Date();

  return [...STATIC_PATHS, ...galleryPaths].flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(locale, path)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
      alternates: { languages: absolute(languageAlternates(path)) },
    }))
  );
}
