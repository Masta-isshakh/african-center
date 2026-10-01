'use client';

import { useLocale, useTranslations } from 'next-intl';
import { brand } from '@/lib/brand';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/i18n/routing';
import { StatCounter } from '@/components/motion/CountUp';

type StatKey = keyof typeof brand.stats;
const labels: Record<StatKey, 'projects' | 'designs' | 'contractors' | 'totalValue'> = {
  projects: 'projects',
  designs: 'designs',
  contractors: 'contractors',
  totalValueQar: 'totalValue',
};

/** Rendered only when every value in `brand.stats` is a confirmed number. */
export function StatsCounters() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const stats = brand.stats as Record<StatKey, number | null>;

  return (
    <ul className="grid gap-6 rounded-xl border border-mist bg-white p-8 shadow-layered sm:grid-cols-2 lg:grid-cols-4">
      {(Object.keys(labels) as StatKey[]).map((key) => {
        const value = stats[key];
        if (value === null) return null;
        const compact = key === 'totalValueQar';
        return (
          <li key={key}>
            <StatCounter
              target={value}
              label={t(`trust.stats.${labels[key]}`, { currency: t('common.currency') })}
              format={(n) => formatNumber(n, locale, compact ? { notation: 'compact', maximumFractionDigits: 1 } : undefined)}
            />
          </li>
        );
      })}
    </ul>
  );
}
