import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { designs } from '@/content/designs';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { DesignsGallery } from './DesignsGallery';
import type { GalleryItem } from './DesignChips';
import { Designs360Lazy } from './Designs360Lazy';

const titledSlots = ['design01', 'design02', 'design03', 'design04', 'design05', 'design06', 'design07', 'design08'] as const;
const isTitled = (slot: string): slot is (typeof titledSlots)[number] => (titledSlots as readonly string[]).includes(slot);

/** Localised alt text and titles for every catalogue entry (shared by the home page and /designs). */
export function useGalleryItems(): GalleryItem[] {
  const t = useTranslations('designs');
  return designs.map((d, i) => {
    const vars = { type: t(`types.${d.type}`), style: t(`styles.${d.style}`), n: String(i + 1) };
    // Delivered renders have their own descriptive title; empty slots fall back to the generic label.
    const title = isTitled(d.slot) ? t(`titles.${d.slot}`) : t('alt', vars);
    return { ...d, n: i + 1, alt: title, title };
  });
}

export function DesignsSection() {
  const t = useTranslations('designs');
  const items = useGalleryItems();
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
          <DesignsGallery items={items} limit={6} />
        </div>
      </div>
    </Section>
  );
}

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
