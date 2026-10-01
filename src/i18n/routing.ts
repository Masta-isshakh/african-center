import { defineRouting } from 'next-intl/routing';

export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'ar',
  localePrefix: 'always',
  // `/` always resolves to Arabic; visitors switch with the AR ⇄ EN pill.
  localeDetection: false,
});

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const dirOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr');

/** Short codes shown in the AR ⇄ EN pill */
export const localeCodes: Record<Locale, string> = { ar: 'AR', en: 'EN' };
