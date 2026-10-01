import { setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { PersonaPage } from '@/components/sections/PersonaPage';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'consultants');
}

export default function Page({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  return <PersonaPage persona="consultant" locale={locale} />;
}
