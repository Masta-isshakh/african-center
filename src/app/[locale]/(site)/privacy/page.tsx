import { setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { LegalPage } from '@/components/sections/LegalPage';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'privacy');
}

export default function Page({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  return <LegalPage locale={locale} doc="privacy" />;
}
