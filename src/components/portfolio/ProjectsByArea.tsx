'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, m } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { MotionScope } from '@/components/motion/MotionScope';
import { QatarMap, type MapPoint } from '@/components/ui/QatarMap';
import { DirIcon } from '@/components/ui/DirIcon';
import type { ProjectCardData } from '@/content/projects.types';
import { ProjectCard } from './ProjectCard';
import { cn } from '@/lib/utils';

export interface AreaInfo {
  id: string;
  name: string;
  count: number;
  lat: number;
  lng: number;
  labelSide: 'start' | 'end';
  labelDy?: number;
}

interface Props {
  items: (ProjectCardData & { area: string })[];
  areas: AreaInfo[];
  /** Stage chip shown on every card (all current projects are at the design stage) */
  stage: string;
}

/** Projects grouped by area: a sticky map with area filters beside the card groups, animated on filter changes. */
function ProjectsByAreaInner({ items, areas, stage }: Props) {
  const t = useTranslations('projectsPage');
  const [area, setArea] = useState<'all' | string>('all');

  const groups = useMemo(
    () => areas.filter((a) => area === 'all' || a.id === area).map((a) => ({ area: a, items: items.filter((i) => i.area === a.id) })).filter((g) => g.items.length > 0),
    [area, areas, items],
  );
  const points: MapPoint[] = areas.map((a) => ({
    id: a.id,
    lat: a.lat,
    lng: a.lng,
    label: a.name,
    labelSide: a.labelSide,
    labelDy: a.labelDy,
    active: area === a.id,
    tone: area === 'all' || area === a.id ? 'gold' : 'white',
  }));

  const pill = (active: boolean) =>
    cn(
      'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors',
      active ? 'border-gold-500 bg-gold-500 text-navy-950' : 'border-white/15 text-white/80 hover:border-gold-400/60 hover:text-white',
    );

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <aside className="lg:col-span-4">
        <div className="surface-dark rounded-xl p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <QatarMap label={t('mapLabel')} className="mx-auto max-w-xs" points={points} />
          <div role="group" aria-label={t('filtersLabel')} className="relative mt-6 flex flex-wrap gap-2">
            <button type="button" aria-pressed={area === 'all'} onClick={() => setArea('all')} className={pill(area === 'all')}>
              {t('all')}
              <span className="num text-xs opacity-70">{items.length}</span>
            </button>
            {areas.map((a) => (
              <button key={a.id} type="button" aria-pressed={area === a.id} onClick={() => setArea(a.id)} className={pill(area === a.id)}>
                {a.name}
                <span className="num text-xs opacity-70">{a.count}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="lg:col-span-8">
        {groups.length === 0 ? (
          <p className="rounded-lg border border-dashed border-mist p-10 text-center text-ink/70">{t('noMatch')}</p>
        ) : (
          <m.div layout className="relative space-y-14">
            <AnimatePresence mode="popLayout" initial={false}>
              {groups.map((g) => (
                <m.section
                  layout
                  key={g.area.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  aria-labelledby={`area-${g.area.id}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-mist pb-3">
                    <h2 id={`area-${g.area.id}`} className="inline-flex items-center gap-2 text-display-lg font-bold text-navy-800">
                      <DirIcon icon={MapPin} className="h-5 w-5 text-gold-700" />
                      {g.area.name}
                    </h2>
                    <span className="text-sm text-ink/60">{t('areaCount', { count: g.items.length })}</span>
                  </div>
                  <ul className="mt-6 grid gap-6 sm:grid-cols-2">
                    {g.items.map((p) => (
                      <li key={p.slug}>
                        <ProjectCard project={p} badge={stage} />
                      </li>
                    ))}
                  </ul>
                </m.section>
              ))}
            </AnimatePresence>
          </m.div>
        )}
      </div>
    </div>
  );
}

/** Framer Motion is scoped to this component (see MotionScope). */
export function ProjectsByArea(props: Props) {
  return (
    <MotionScope>
      <ProjectsByAreaInner {...props} />
    </MotionScope>
  );
}
