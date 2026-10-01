import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Clock, Lightbulb } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { materials, hasPrices } from '@/content/materials';
import { PageHero } from '@/components/ui/PageHero';
import { Chip } from '@/components/ui/Section';
import { Freshness } from '@/components/ui/Freshness';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { MaterialsTable } from '@/components/sections/MaterialsTable';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'materials');
}

export default async function MaterialsPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'materialsPage' });
  const tm = await getTranslations({ locale, namespace: 'materials' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  return (
    <>
      <PageHero locale={locale} crumbs={[{ name: t('eyebrow'), path: '/materials' }]} eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')}>
        <div className="flex flex-wrap items-center gap-3">
          <Freshness updatedAt={materials.updatedAt} dark />
          {materials.sample && <Chip tone="gold">{tc('sampleBadge')}</Chip>}
        </div>
      </PageHero>
      <section className="surface-topo py-16 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {!hasPrices(materials) && (
              <p className="mb-6 flex items-start gap-3 rounded-lg border border-dashed border-gold-500/40 bg-gold-50/70 p-5 text-ink/80">
                <DirIcon icon={Clock} className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
                <span>
                  <strong className="block font-semibold text-navy-800">{tm('pendingTitle')}</strong>
                  {tm('pendingBody')}
                </span>
              </p>
            )}
            <MaterialsTable />
            <p className="mt-4 text-sm text-ink/70">
              {tm('source')} — {tm('disclaimer')}
            </p>
            {materials.sample && <p className="mt-2 text-xs text-gold-800">{tc('sampleNote')}</p>}
          </div>
          <aside className="space-y-5 lg:col-span-4">
            <div className="rounded-xl border border-mist bg-white p-6">
              <h2 className="flex items-center gap-2 font-body text-lg font-semibold text-navy-800">
                <DirIcon icon={Lightbulb} className="h-5 w-5 text-gold-700" />
                {t('whyTitle')}
              </h2>
              <ul className="mt-4 list-disc space-y-2 ps-5 text-sm text-ink/75 marker:text-gold-600">
                {(['w1', 'w2', 'w3'] as const).map((k) => (
                  <li key={k}>{t(`why.${k}`)}</li>
                ))}
              </ul>
            </div>
            <ButtonLink href="/sign-up?persona=supplier" variant="navy" className="w-full" trackEvent="cta_register_persona" trackProps={{ persona: 'supplier', placement: 'materials_page' }}>
              {t('supplierCta')}
              <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
            </ButtonLink>
          </aside>
        </div>
      </section>
    </>
  );
}
