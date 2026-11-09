import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Building2, MapPin } from 'lucide-react';
import { pageMetadata, itemListJsonLd, localizedUrl } from '@/lib/seo';
import { siteUrl } from '@/lib/site';
import { portfolioAreas, portfolioStats, projects, toCardData } from '@/content/projects';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';
import { CtaBand } from '@/components/ui/CtaBand';
import { DirIcon } from '@/components/ui/DirIcon';
import { JsonLd } from '@/components/ui/JsonLd';
import { ProjectsByArea } from '@/components/portfolio/ProjectsByArea';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'projects');
}

export default async function ProjectsPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projectsPage' });
  const tp = await getTranslations({ locale, namespace: 'portfolio' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const items = projects.map((p) => ({ ...toCardData(p, locale), area: p.area }));
  const areas = [...portfolioAreas].sort((a, b) => b.lat - a.lat).map((a) => ({ id: a.id, name: a.name[locale], count: a.count, lat: a.lat, lng: a.lng, labelSide: a.labelSide, labelDy: a.labelDy }));
  const stats = [
    { icon: Building2, text: tp('stats.projects', { count: portfolioStats.projects }) },
    { icon: MapPin, text: tp('stats.areas', { count: portfolioStats.areas }) },
  ];

  return (
    <>
      <PageHero locale={locale} crumbs={[{ name: t('eyebrow'), path: '/projects' }]} eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')}>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-white/80">
          {stats.map((s) => (
            <li key={s.text} className="inline-flex items-center gap-2">
              <DirIcon icon={s.icon} className="h-4 w-4 text-gold-400" />
              {s.text}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="surface-topo py-16 sm:py-20">
        <div className="container-site">
          <ProjectsByArea items={items} areas={areas} stage={t('statuses.design')} />
        </div>
      </section>

      <CtaBand title={t('cta.title')} body={t('cta.body')} cta={tc('ctaStart')} href="/start" trackProps={{ placement: 'projects_page' }} />

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
