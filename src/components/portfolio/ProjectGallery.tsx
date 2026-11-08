'use client';

import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { AnimatePresence, m } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { MotionScope } from '@/components/motion/MotionScope';
import { DirIcon } from '@/components/ui/DirIcon';
import { imageCategories, type GalleryImage, type ImageCategory } from '@/content/projects.types';
import { track } from '@/lib/analytics';
import { ProjectImage } from './ProjectImage';
import { cn } from '@/lib/utils';

// The viewer only matters after a click, so it never ships in the initial bundle.
const ProjectLightbox = dynamic(() => import('./ProjectLightbox').then((mod) => mod.ProjectLightbox), { ssr: false });

type Filter = 'all' | ImageCategory;

interface Props {
  items: GalleryImage[];
  /** Project slug, for analytics and stable layout ids */
  project: string;
}

/**
 * Uniform 3:2 tiles in a dense grid (portrait renders span two rows), category chips when a project has
 * more than one kind of view, and a keyboard/swipe lightbox.
 */
function ProjectGalleryInner({ items, project }: Props) {
  const t = useTranslations('portfolio');
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<number | null>(null);

  const categories = useMemo(() => imageCategories.filter((c) => items.some((i) => i.category === c)), [items]);
  const visible = useMemo(() => (filter === 'all' ? items : items.filter((i) => i.category === filter)), [items, filter]);
  const showFilters = categories.length > 1;

  const openAt = (i: number) => {
    setOpen(i);
    track('project_lightbox_opened', { project, image: visible[i].key });
  };

  return (
    <div>
      {showFilters && (
        <div role="group" aria-label={t('gallery.filterLabel')} className="no-scrollbar -mx-[2.5vw] flex gap-2 overflow-x-auto px-[2.5vw] pb-1">
          {(['all', ...categories] as Filter[]).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={cn('relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors', filter === c ? 'text-navy-950' : 'text-ink/70 hover:text-navy-800')}
            >
              {filter === c && <m.span layoutId={`gallery-filter-${project}`} className="absolute inset-0 rounded-full bg-gold-500" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative inline-flex items-baseline gap-1.5">
                {t(`categories.${c}`)}
                <span className="num text-xs opacity-70">{c === 'all' ? items.length : items.filter((i) => i.category === c).length}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-mist p-10 text-center text-ink/70">{t('gallery.empty')}</p>
      ) : (
        <m.ul layout className={cn('grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3', showFilters && 'mt-10')}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((img, i) => {
              const portrait = img.height > img.width;
              return (
                <m.li
                  layout
                  key={img.key}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(portrait && 'sm:row-span-2')}
                >
                  <figure className={cn('group h-full overflow-hidden rounded-xl border border-mist bg-white shadow-layered', portrait && 'sm:grid sm:grid-rows-[1fr_auto]')}>
                    <button
                      type="button"
                      onClick={() => openAt(i)}
                      aria-label={t('gallery.open', { caption: img.alt })}
                      className={cn('relative block w-full overflow-hidden bg-navy-900 text-start', portrait ? 'aspect-[3/4] sm:aspect-auto sm:min-h-0' : 'aspect-[3/2]')}
                    >
                      <ProjectImage
                        image={img}
                        maxWidth={1440}
                        alt={img.alt}
                        fill
                        sizes="(min-width:1024px) 31vw, (min-width:640px) 48vw, 95vw"
                        placeholder="blur"
                        blurDataURL={img.blur}
                        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                      />
                      <span className="absolute end-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-navy-950/70 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        <DirIcon icon={Maximize2} className="h-4 w-4" />
                      </span>
                    </button>
                    <figcaption className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span className="font-semibold text-navy-800">{img.alt}</span>
                      <span className="shrink-0 text-xs text-ink/55">{t(`categories.${img.category}`)}</span>
                    </figcaption>
                  </figure>
                </m.li>
              );
            })}
          </AnimatePresence>
        </m.ul>
      )}

      {/* Portalled to <body>: an ancestor with content-visibility/transform would otherwise become the containing block of the fixed dialog. */}
      {open !== null && createPortal(<ProjectLightbox items={visible} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />, document.body)}
    </div>
  );
}

/** Framer Motion is scoped to this component (see MotionScope). */
export function ProjectGallery(props: Props) {
  return (
    <MotionScope>
      <ProjectGalleryInner {...props} />
    </MotionScope>
  );
}
