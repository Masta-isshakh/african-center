import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Hourglass } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { showSampleContent } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';
import { QatarMap } from '@/components/ui/QatarMap';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { TrustRow } from '@/components/ui/TrustRow';
import { ProjectsExplorer } from '@/components/sections/ProjectsExplorer';
import { serviceCities } from '@/components/sections/MapTeaser';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'projects');
}

export default async function ProjectsPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projectsPage' });
  const tm = await getTranslations({ locale, namespace: 'map' });

  return (
    <>
      <PageHero locale={locale} crumbs={[{ name: t('eyebrow'), path: '/projects' }]} eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
      <section className="surface-topo py-16 sm:py-20">
        <div className="container-site">
          {showSampleContent ? (
            <ProjectsExplorer />
          ) : (
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="rounded-xl border border-dashed border-gold-500/40 bg-white p-8 sm:p-10 lg:col-span-7">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-navy-700 text-gold-300">
                  <DirIcon icon={Hourglass} className="h-6 w-6" />
                </span>
                <h2 className="mt-6 text-display-lg font-bold text-navy-800">{t('emptyTitle')}</h2>
                <p className="mt-3 max-w-xl text-ink/70">{t('emptyBody')}</p>
                <ButtonLink href="/start" className="mt-8" trackEvent="cta_start_project" trackProps={{ placement: 'projects_empty' }}>
                  {t('emptyCta')}
                  <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
                </ButtonLink>
                <TrustRow className="mt-6" />
              </div>
              <div className="surface-dark rounded-xl p-8 lg:col-span-5">
                <QatarMap label={tm('mapLabel')} className="mx-auto max-w-xs" points={serviceCities.map((c) => ({ ...c, label: tm(`cities.${c.id}`) }))} />
                <p className="mt-4 text-center text-sm text-white/65">{tm('lead')}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
