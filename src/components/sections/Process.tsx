import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { stepSlots } from '@/lib/media';
import { pad2 } from '@/lib/utils';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { TrustRow } from '@/components/ui/TrustRow';
import { ProcessTimeline, type TimelineStep } from './ProcessTimeline';

const stepKeys = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'] as const;

export function Process() {
  const t = useTranslations('process');
  const steps: TimelineStep[] = stepKeys.map((k, i) => ({
    slot: stepSlots[i],
    title: t(`steps.${k}.title`),
    body: t(`steps.${k}.body`),
    alt: t(`steps.${k}.alt`),
    label: t('stepLabel', { n: pad2(i + 1) }),
  }));

  return (
    <Section id="how" tone="dark" labelledBy="how-title">
      <div className="container-site">
        <SectionHeading id="how-title" dark align="center" eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <div className="mt-20">
          <ProcessTimeline steps={steps} progressLabel={t('progressLabel')} />
        </div>
        <div className="mt-20 flex flex-col items-center gap-6">
          <ButtonLink href="/start" size="lg" trackEvent="cta_start_project" trackProps={{ placement: 'process' }}>
            {t('cta')}
            <DirIcon icon={ArrowRight} flip className="h-5 w-5" />
          </ButtonLink>
          <TrustRow dark align="center" />
        </div>
      </div>
    </Section>
  );
}
