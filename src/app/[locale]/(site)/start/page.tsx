import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Check } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';
import { DirIcon } from '@/components/ui/DirIcon';
import { TrustRow } from '@/components/ui/TrustRow';
import { BriefWizard } from '@/components/sections/BriefWizard';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'start');
}

export default async function StartPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'start' });
  return (
    <>
      <PageHero locale={locale} compact crumbs={[{ name: t('eyebrow'), path: '/start' }]} eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')}>
        <TrustRow dark />
      </PageHero>
      <section className="surface-topo py-14 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <BriefWizard />
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-xl border border-mist bg-white p-6 lg:sticky lg:top-28">
              <h2 className="font-body text-lg font-semibold text-navy-800">{t('asideTitle')}</h2>
              <p className="mt-2 text-sm text-ink/70">{t('asideBody')}</p>
              <ul className="mt-5 space-y-3">
                {(['l1', 'l2', 'l3'] as const).map((k) => (
                  <li key={k} className="flex gap-3 text-sm text-ink/80">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-700">
                      <DirIcon icon={Check} className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {t(`asideList.${k}`)}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
