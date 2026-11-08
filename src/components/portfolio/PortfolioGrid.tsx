'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, m } from 'framer-motion';
import { MotionScope } from '@/components/motion/MotionScope';
import { projectFilters, type ProjectCardData, type ProjectFilter } from '@/content/projects.types';
import { ProjectCard } from './ProjectCard';
import { cn } from '@/lib/utils';

/** Style filter with a sliding gold pill and a layout-animated card grid. */
function PortfolioGridInner({ items }: { items: ProjectCardData[] }) {
  const t = useTranslations('portfolio');
  const [filter, setFilter] = useState<ProjectFilter>('all');

  const counts = useMemo(
    () => Object.fromEntries(projectFilters.map((f) => [f, items.filter((p) => f === 'all' || p.style === f).length])) as Record<ProjectFilter, number>,
    [items],
  );
  const visible = useMemo(() => items.filter((p) => filter === 'all' || p.style === filter), [items, filter]);

  return (
    <div>
      <div role="group" aria-label={t('filtersLabel')} className="no-scrollbar -mx-[2.5vw] flex gap-2 overflow-x-auto px-[2.5vw] pb-1">
        {projectFilters
          .filter((f) => counts[f] > 0)
          .map((f) => (
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
              {filter === f && <m.span layoutId="portfolio-filter" className="absolute inset-0 rounded-full bg-gold-500" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative inline-flex items-baseline gap-1.5">
                {t(`filters.${f}`)}
                <span className="num text-xs opacity-70">{counts[f]}</span>
              </span>
            </button>
          ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-mist p-10 text-center text-ink/70">{t('empty')}</p>
      ) : (
        <m.ul layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <m.li
                layout
                key={p.slug}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={p} priority={i < 3} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      )}
    </div>
  );
}

/** Framer Motion is scoped to this component (see MotionScope). */
export function PortfolioGrid(props: { items: ProjectCardData[] }) {
  return (
    <MotionScope>
      <PortfolioGridInner {...props} />
    </MotionScope>
  );
}
