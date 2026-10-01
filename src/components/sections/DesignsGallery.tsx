'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { AnimatePresence, m } from 'framer-motion';
import { MotionScope } from '@/components/motion/MotionScope';
import { Maximize2 } from 'lucide-react';
import { designFilters, matchesFilter, type DesignFilter } from '@/content/designs';
import { track } from '@/lib/analytics';
import { Media } from '@/components/ui/Media';
import { DesignChips, type GalleryItem } from './DesignChips';
import { DirIcon } from '@/components/ui/DirIcon';
import { cn } from '@/lib/utils';

// The viewer only matters after a click, so it never ships in the initial bundle.
const Lightbox = dynamic(() => import('./Lightbox').then((mod) => mod.Lightbox), { ssr: false });

/** Filterable masonry with layout-animated reflow and a keyboard/swipe lightbox. */
function DesignsGalleryInner({ items, limit, showChips }: { items: GalleryItem[]; limit?: number; showChips?: boolean }) {
  const t = useTranslations('designs');
  const [filter, setFilter] = useState<DesignFilter>('all');
  const [open, setOpen] = useState<number | null>(null);

  const visible = useMemo(() => {
    const list = items.filter((d) => matchesFilter(d, filter));
    return limit ? list.slice(0, limit) : list;
  }, [items, filter, limit]);

  const openAt = (i: number) => {
    setOpen(i);
    track('design_lightbox_opened', { design: visible[i].slot });
  };

  return (
    <div>
      <div role="group" aria-label={t('filtersLabel')} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {designFilters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              'relative shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors',
              filter === f ? 'text-navy-950' : 'text-ink/70 hover:text-navy-800',
            )}
          >
            {filter === f && <m.span layoutId="design-filter" className="absolute inset-0 rounded-full bg-gold-500" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span className="relative">{t(`filters.${f}`)}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-mist p-10 text-center text-ink/70">{t('empty')}</p>
      ) : (
        <m.ul layout className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item, i) => (
              <m.li
                layout
                key={item.slot}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="break-inside-avoid"
              >
                <figure className="group overflow-hidden rounded-xl border border-mist bg-white shadow-layered">
                  <button type="button" onClick={() => openAt(i)} className="relative block w-full overflow-hidden text-start" aria-label={t('open', { n: String(item.n) })}>
                    <Media slot={item.slot} alt={item.alt} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute end-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-navy-950/70 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      <DirIcon icon={Maximize2} className="h-4 w-4" />
                    </span>
                  </button>
                  <figcaption className="flex flex-wrap items-center gap-2 p-4">
                    <span className="me-auto text-sm font-semibold text-navy-800">{item.title}</span>
                    {showChips && <DesignChips item={item} />}
                  </figcaption>
                </figure>
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      )}

      {open !== null && <Lightbox items={visible} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

/** Framer Motion is scoped to this component (see MotionScope). */
export function DesignsGallery(props: { items: GalleryItem[]; limit?: number; showChips?: boolean }) {
  return (
    <MotionScope>
      <DesignsGalleryInner {...props} />
    </MotionScope>
  );
}
