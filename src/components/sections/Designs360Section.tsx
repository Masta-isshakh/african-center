import { useTranslations } from 'next-intl';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Designs360Lazy } from './Designs360Lazy';

export function Designs360Section() {
  const t = useTranslations('designs360');
  return (
    <Section tone="dark" labelledBy="d360-title">
      <div className="container-site">
        <SectionHeading id="d360-title" dark eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <div className="mt-12">
          <Designs360Lazy />
        </div>
      </div>
    </Section>
  );
}
