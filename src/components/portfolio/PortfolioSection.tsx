import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { featuredProjects, toCardData } from '@/content/projects';
import type { Locale } from '@/i18n/routing';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { ProjectCardGrid } from './ProjectCardGrid';

/** Home-page teaser: the six featured designs, linking through to /designs. */
export function PortfolioSection() {
  const t = useTranslations('designs');
  const locale = useLocale() as Locale;
  const items = featuredProjects.map((p) => toCardData(p, locale));
  return (
    <Section id="designs" tone="sand" labelledBy="designs-title">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="designs-title" eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
          <ButtonLink href="/designs" variant="outline" className="shrink-0 self-start lg:self-end">
            {t('showMore')}
            <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
          </ButtonLink>
        </div>
        <div className="mt-12">
          <ProjectCardGrid items={items} />
        </div>
      </div>
    </Section>
  );
}
