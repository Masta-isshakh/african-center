'use client';

import { useTranslations } from 'next-intl';
import type { Design } from '@/content/designs';
import { Chip } from '@/components/ui/Section';

export interface GalleryItem extends Design {
  n: number;
  alt: string;
  title: string;
}

/** Style / area / bedrooms chips; area and bedrooms hide until filled in `content/designs.ts`. */
export function DesignChips({ item }: { item: GalleryItem }) {
  const t = useTranslations('designs');
  return (
    <>
      <Chip>{t(`styles.${item.style}`)}</Chip>
      {item.area !== null && (
        <Chip>
          <span className="num">{t('chips.area', { value: item.area })}</span>
        </Chip>
      )}
      {item.bedrooms !== null && <Chip>{t('chips.bedrooms', { count: item.bedrooms })}</Chip>}
    </>
  );
}
