'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { formatDate, isFresh } from '@/lib/format';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Honesty gate for the "live" pulse: shown only when the bulletin is ≤ 7 days old,
 * evaluated in the visitor's browser so a static build never claims stale prices are live.
 */
export function Freshness({ updatedAt, dark, className }: { updatedAt: string | null; dark?: boolean; className?: string }) {
  const t = useTranslations('materials');
  const locale = useLocale() as Locale;
  const [fresh, setFresh] = useState(false);

  useEffect(() => setFresh(isFresh(updatedAt)), [updatedAt]);

  if (!updatedAt) return null;
  return (
    <span className={cn('inline-flex items-center gap-2 text-xs font-medium', dark ? 'text-white/70' : 'text-ink/65', className)}>
      {fresh && (
        <span className="relative grid h-2.5 w-2.5 place-items-center" aria-hidden="true">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success" />
          <span className="relative h-2 w-2 rounded-full bg-success" />
        </span>
      )}
      {fresh && <span className={cn('font-semibold', dark ? 'text-emerald-300' : 'text-success')}>{t('live')}</span>}
      <span>{t('updatedOn', { date: formatDate(updatedAt, locale) })}</span>
    </span>
  );
}
