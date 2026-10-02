import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['cs', 'en', 'de'],
  defaultLocale: 'cs',
  // Czech stays on unprefixed URLs (/services), others get a prefix (/en/services)
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
