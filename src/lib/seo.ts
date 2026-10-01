import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { brand, configuredSocials, filled } from './brand';
import { siteUrl, type AppRoute } from './site';
import { media } from './media';
import type { Locale } from '@/i18n/routing';

export type MetaPage =
  | 'home'
  | 'owners'
  | 'contractors'
  | 'suppliers'
  | 'consultants'
  | 'start'
  | 'designs'
  | 'projects'
  | 'materials'
  | 'faq'
  | 'about'
  | 'contact'
  | 'signIn'
  | 'signUp'
  | 'privacy'
  | 'terms';

export const pathOf: Record<MetaPage, AppRoute> = {
  home: '',
  owners: '/owners',
  contractors: '/contractors',
  suppliers: '/suppliers',
  consultants: '/consultants',
  start: '/start',
  designs: '/designs',
  projects: '/projects',
  materials: '/materials',
  faq: '/faq',
  about: '/about',
  contact: '/contact',
  signIn: '/sign-in',
  signUp: '/sign-up',
  privacy: '/privacy',
  terms: '/terms',
};

export const localizedUrl = (locale: Locale, path: string) => `${siteUrl}/${locale}${path}`;

export function languageAlternates(path: string) {
  return {
    'ar-QA': localizedUrl('ar', path),
    'en-QA': localizedUrl('en', path),
    'x-default': localizedUrl('ar', path),
  };
}

export const titleSuffix = (locale: Locale) => (locale === 'ar' ? brand.name.ar : brand.shortName);

/** Localised title/description, canonical, hreflang alternates, Open Graph and Twitter for a route. */
export async function pageMetadata(locale: Locale, page: MetaPage): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const vars = { reg: brand.registration.number };
  const title = t(`${page}.title`, vars);
  const description = t(`${page}.description`, vars);
  const path = pathOf[page];
  const url = localizedUrl(locale, path);
  const fullTitle = page === 'home' ? `${title} | ${brand.shortName}` : `${title} | ${titleSuffix(locale)}`;

  return {
    title: page === 'home' ? { absolute: fullTitle } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: 'website',
      url,
      title: fullTitle,
      description,
      siteName: brand.name[locale],
      locale: locale === 'ar' ? 'ar_QA' : 'en_QA',
      alternateLocale: locale === 'ar' ? ['en_QA'] : ['ar_QA'],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
  };
}

/* ───────────── JSON-LD ───────────── */

const orgId = `${siteUrl}/#organization`;

/** `credentialName` is the localised `common.registrationLine`. */
export function organizationJsonLd(locale: Locale, credentialName: string) {
  const sameAs = configuredSocials().map((s) => s.url);
  const logo = media.logoFull ?? media.logoMark;
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': orgId,
    name: brand.name[locale],
    alternateName: [brand.name[locale === 'ar' ? 'en' : 'ar'], brand.shortName],
    slogan: brand.slogan[locale],
    url: localizedUrl(locale, ''),
    ...(logo ? { logo: `${siteUrl}${logo}`, image: `${siteUrl}${logo}` } : {}),
    email: brand.email,
    telephone: brand.phones[0],
    contactPoint: brand.phones.map((telephone) => ({
      '@type': 'ContactPoint',
      telephone,
      contactType: 'customer service',
      areaServed: 'QA',
      availableLanguage: ['ar', 'en'],
    })),
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address[locale],
      addressLocality: brand.locality[locale],
      addressCountry: 'QA',
    },
    geo: { '@type': 'GeoCoordinates', latitude: brand.geo.lat, longitude: brand.geo.lng },
    openingHours: brand.openingHours,
    areaServed: { '@type': 'Country', name: 'Qatar' },
    ...(filled(brand.foundingYear) ? { foundingDate: brand.foundingYear } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      name: credentialName,
      identifier: brand.registration.number,
    },
    knowsLanguage: ['ar', 'en'],
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website-${locale}`,
    url: localizedUrl(locale, ''),
    name: brand.name[locale],
    inLanguage: locale === 'ar' ? 'ar-QA' : 'en-QA',
    publisher: { '@id': orgId },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })),
  };
}

export function faqJsonLd(qa: { q: string; a: string }[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'ar' ? 'ar-QA' : 'en-QA',
    mainEntity: qa.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

export function serviceJsonLd({ name, description, url, audience }: { name: string; description: string; url: string; audience: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: { '@id': orgId },
    areaServed: { '@type': 'Country', name: 'Qatar' },
    audience: { '@type': 'Audience', audienceType: audience },
  };
}

export function itemListJsonLd(items: { name: string; url: string; image?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'CreativeWork', name: item.name, url: item.url, ...(item.image ? { image: item.image } : {}) },
    })),
  };
}
