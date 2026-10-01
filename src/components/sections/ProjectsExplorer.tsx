'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, m } from 'framer-motion';
import { MotionScope } from '@/components/motion/MotionScope';
import { MapPin } from 'lucide-react';
import { projectStatuses, sampleProjects, type ProjectStatus } from '@/content/samples';
import type { Locale } from '@/i18n/routing';
import { QatarMap } from '@/components/ui/QatarMap';
import { DirIcon } from '@/components/ui/DirIcon';
import { Chip } from '@/components/ui/Section';
import { cn } from '@/lib/utils';

const statusTone: Record<ProjectStatus, string> = {
  design: 'bg-navy-50 text-navy-700 border-navy-100',
  tender: 'bg-gold-50 text-gold-800 border-gold-200',
  construction: 'bg-amber-50 text-amber-800 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

/** Sample-preview explorer: status filter, animated map pins and a linked list. */
function ProjectsExplorerInner() {
  const t = useTranslations('projectsPage');
  const tc = useTranslations('common');
  const locale = useLocale() as Locale;
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [hover, setHover] = useState<string | null>(null);
  const list = sampleProjects.filter((p) => filter === 'all' || p.status === filter);

  return (
    <div>
      <div role="group" aria-label={t('filtersLabel')} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {(['all', ...projectStatuses] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
            className={cn('shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors', filter === s ? 'border-gold-500 bg-gold-500 text-navy-950' : 'border-mist bg-white text-ink/70 hover:text-navy-800')}
          >
            {s === 'all' ? t('all') : t(`statuses.${s}`)}
          </button>
        ))}
      </div>
      <p className="mt-4">
        <Chip tone="gold">{tc('sampleBadge')}</Chip>
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="surface-dark rounded-xl p-6 lg:col-span-5">
          <QatarMap
            label={t('mapLabel')}
            className="mx-auto max-w-xs"
            points={list.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, active: hover === p.id, tone: hover === p.id ? 'white' : 'gold' }))}
          />
        </div>
        <ul aria-label={t('listLabel')} className="space-y-3 lg:col-span-7">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.length === 0 && (
              <m.li key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-dashed border-mist p-8 text-center text-ink/70">
                {t('noMatch')}
              </m.li>
            )}
            {list.map((p) => (
              <m.li
                layout
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                className="card-lift flex items-center gap-4 rounded-lg border border-mist bg-white p-5"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-700 text-gold-300">
                  <DirIcon icon={MapPin} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy-800">{p.name[locale]}</p>
                  <p className="mt-0.5 text-sm text-ink/70">
                    {tc(`municipalities.${p.municipality}`)} · <span className="num">{t('area', { value: p.area })}</span>
                  </p>
                </div>
                <span className={cn('shrink-0 rounded-full border px-3 py-1 text-xs font-semibold', statusTone[p.status])}>{t(`statuses.${p.status}`)}</span>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <p className="mt-6 text-xs text-ink/65">{tc('sampleNote')}</p>
    </div>
  );
}

/** Framer Motion is scoped to this component (see MotionScope). */
export function ProjectsExplorer() {
  return (
    <MotionScope>
      <ProjectsExplorerInner />
    </MotionScope>
  );
}
