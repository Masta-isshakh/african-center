import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { toShowcaseCard, walkthroughShowcase } from '@/content/showcase';
import { Section, SectionHeading } from '@/components/ui/Section';
import ShowcaseCarousel from './ShowcaseCarousel';

/** "Walk through your villa before it is built": courtyards, pools, entrances and interiors from the company's projects. */
export function ShowcaseSection() {
  const t = useTranslations('showcase');
  const locale = useLocale() as Locale;
  const items = walkthroughShowcase.map((s) => toShowcaseCard(s, locale));
  return (
    <Section tone="dark" labelledBy="showcase-title">
      <div className="container-site">
        <SectionHeading id="showcase-title" dark eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <div className="mt-12">
          <ShowcaseCarousel items={items} />
        </div>
      </div>
    </Section>
  );
}
