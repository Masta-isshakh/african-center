import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { AuthShell } from '@/components/sections/auth/AuthShell';
import { SignUpWizard } from '@/components/sections/auth/SignUpWizard';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'signUp');
}

/** Same footprint as the wizard so the static shell doesn't jump when `?persona=` is read on the client. */
function WizardSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-mist" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-lg bg-mist/60" />
    </div>
  );
}

export default async function SignUpPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'auth.signUp' });
  return (
    <AuthShell locale={locale} crumb={t('eyebrow')} path="/sign-up" eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')}>
      <Suspense fallback={<WizardSkeleton />}>
        <SignUpWizard />
      </Suspense>
    </AuthShell>
  );
}
