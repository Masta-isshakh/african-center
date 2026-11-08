import { useTranslations } from 'next-intl';
import { portfolioAreas } from '@/content/projects';
import type { Locale } from '@/i18n/routing';
import { Section, SectionHeading } from '@/components/ui/Section';
import { QatarMap, type MapPoint } from '@/components/ui/QatarMap';
import { Reveal, RevealItem } from '@/components/motion/Reveal';

/** Every area with at least one design, pinned on the stylised Qatar map with a count beside it. */
export function PortfolioMap({ locale }: { locale: Locale }) {
  const t = useTranslations('portfolio.map');
  const points: MapPoint[] = portfolioAreas.map((a) => ({ id: a.id, lat: a.lat, lng: a.lng, label: a.name[locale], labelSide: a.labelSide, labelDy: a.labelDy }));
  return (
    <Section tone="dark" labelledBy="portfolio-map-title" className="overflow-hidden">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading id="portfolio-map-title" dark eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
          <Reveal stagger as="ul" className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {portfolioAreas.map((a) => (
              <RevealItem as="li" key={a.id} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <p className="font-semibold text-white">{a.name[locale]}</p>
                <p className="mt-0.5 text-sm text-white/60">{t('count', { count: a.count })}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
        <Reveal className="mx-auto w-full max-w-sm lg:max-w-md">
          <QatarMap points={points} label={t('label')} />
        </Reveal>
      </div>
    </Section>
  );
}
