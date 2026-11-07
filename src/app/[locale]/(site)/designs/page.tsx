import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Building2, Images, MapPin } from 'lucide-react';
import { pageMetadata, itemListJsonLd, localizedUrl } from '@/lib/seo';
import { siteUrl } from '@/lib/site';
import { projects, portfolioStats, toCardData } from '@/content/projects';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';
import { CtaBand } from '@/components/ui/CtaBand';
import { Divider } from '@/components/ui/Divider';
import { DirIcon } from '@/components/ui/DirIcon';
import { JsonLd } from '@/components/ui/JsonLd';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { PortfolioMap } from '@/components/portfolio/PortfolioMap';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'designs');
}

export default async function DesignsPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'designsPage' });
  const tp = await getTranslations({ locale, namespace: 'portfolio' });
  const td = await getTranslations({ locale, namespace: 'designs' });
  const items = projects.map((p) => toCardData(p, locale));
  const stats = [
    { icon: Building2, text: tp('stats.projects', { count: portfolioStats.projects }) },
    { icon: Images, text: tp('stats.views', { count: portfolioStats.views }) },
    { icon: MapPin, text: tp('stats.areas', { count: portfolioStats.areas }) },
  ];

  return (
    <>
      <PageHero locale={locale} crumbs={[{ name: t('eyebrow'), path: '/designs' }]} eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')}>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-white/80">
          {stats.map((s) => (
            <li key={s.text} className="inline-flex items-center gap-2">
              <DirIcon icon={s.icon} className="h-4 w-4 text-gold-400" />
              {s.text}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="bg-sand py-16 sm:py-20">
        <div className="container-site">
          <PortfolioGrid items={items} />
        </div>
      </section>

      <Divider from="sand" to="charcoal" />
      <PortfolioMap locale={locale} />
      <Divider from="charcoal" to="sand" shape="curve" />

      <CtaBand title={tp('cta.title')} body={tp('cta.body')} cta={td('requestSimilar')} href="/start" trackProps={{ placement: 'designs_page' }} />

      <JsonLd
        data={itemListJsonLd(
          projects.map((p) => ({
            name: p.title[locale],
            url: localizedUrl(locale, `/designs/${p.slug}`),
            image: `${siteUrl}${p.cover.src}`,
          })),
        )}
      />
    </>
  );
}
