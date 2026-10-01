import { useTranslations } from 'next-intl';
import { ArrowRight, Clock } from 'lucide-react';
import { materials, teaserMaterialIds, pickMaterials, hasPrices } from '@/content/materials';
import { Section, SectionHeading, Chip } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { Freshness } from '@/components/ui/Freshness';
import { PriceTile } from '@/components/ui/PriceTile';
import { Reveal, RevealItem } from '@/components/motion/Reveal';

export function MaterialsTeaser() {
  const t = useTranslations();
  const items = pickMaterials(materials, teaserMaterialIds);
  const published = hasPrices(materials);

  return (
    <Section id="materials" tone="sand" labelledBy="materials-title">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <SectionHeading id="materials-title" eyebrow={t('materials.eyebrow')} title={t('materials.title')} lead={t('materials.lead')} />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Freshness updatedAt={materials.updatedAt} />
            {materials.sample && <Chip tone="gold">{t('common.sampleBadge')}</Chip>}
          </div>
          <ButtonLink href="/materials" variant="outline" className="mt-8" trackEvent="materials_tab_opened" trackProps={{ placement: 'home_teaser' }}>
            {t('materials.viewAll')}
            <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
          </ButtonLink>
        </div>
        <div className="lg:col-span-7">
          <Reveal stagger as="ul" className="grid gap-4 sm:grid-cols-3">
            {items.map((item) => (
              <RevealItem as="li" key={item.id}>
                <PriceTile item={item} />
              </RevealItem>
            ))}
          </Reveal>
          {!published && (
            <p className="mt-5 flex items-start gap-2 rounded-lg border border-dashed border-gold-500/40 bg-gold-50/60 p-4 text-sm text-ink/75">
              <DirIcon icon={Clock} className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
              <span>
                <strong className="font-semibold text-navy-800">{t('materials.pendingTitle')}</strong> — {t('materials.pendingBody')}
              </span>
            </p>
          )}
          <p className="mt-4 text-xs text-ink/65">{t('materials.disclaimer')}</p>
        </div>
      </div>
    </Section>
  );
}
