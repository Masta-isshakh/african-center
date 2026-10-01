import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, MessageCircleQuestion } from 'lucide-react';
import { pageMetadata, faqJsonLd } from '@/lib/seo';
import { commissionPhrase } from '@/lib/commission';
import { faqIndex } from '@/content/faq';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';
import { JsonLd } from '@/components/ui/JsonLd';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { FaqExplorer } from '@/components/sections/FaqExplorer';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'faq');
}

export default async function FaqPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'faqPage' });
  const tq = await getTranslations({ locale, namespace: 'faqItems' });
  const commission = commissionPhrase(t);
  const qa = faqIndex.map((f) => ({ q: tq(`${f.id}.q`), a: tq(`${f.id}.a`, { commission }) }));

  return (
    <>
      <PageHero locale={locale} crumbs={[{ name: t('eyebrow'), path: '/faq' }]} eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
      <section className="surface-topo py-16 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <FaqExplorer commission={commission} />
          </div>
          <aside className="lg:col-span-4">
            <div className="surface-dark rounded-xl p-7 lg:sticky lg:top-28">
              <DirIcon icon={MessageCircleQuestion} className="h-8 w-8 text-gold-400" />
              <h2 className="mt-4 font-body text-xl font-semibold text-white">{t('stillTitle')}</h2>
              <p className="mt-2 text-sm text-white/70">{t('stillBody')}</p>
              <ButtonLink href="/contact" className="mt-6">
                {t('stillCta')}
                <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>
      <JsonLd data={faqJsonLd(qa, locale)} />
    </>
  );
}
