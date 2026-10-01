import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { AuthShell } from '@/components/sections/auth/AuthShell';
import { SignInForm } from '@/components/sections/auth/SignInForm';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'signIn');
}

export default async function SignInPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'auth.signIn' });
  return (
    <AuthShell locale={locale} crumb={t('eyebrow')} path="/sign-in" eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')}>
      <SignInForm />
    </AuthShell>
  );
}
