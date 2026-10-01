import { useLocale, useTranslations } from 'next-intl';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { changeOf, type MaterialPrice } from '@/content/materials';
import { formatNumber } from '@/lib/format';
import type { Locale } from '@/i18n/routing';
import { DirIcon } from './DirIcon';
import { cn } from '@/lib/utils';

export function usePriceFormatter() {
  const locale = useLocale() as Locale;
  return (n: number) => formatNumber(n, locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/** Arrow + percentage versus the previous bulletin. Renders an em dash when there is nothing to compare. */
export function PriceChange({ item, dark }: { item: MaterialPrice; dark?: boolean }) {
  const t = useTranslations('materials.change');
  const locale = useLocale() as Locale;
  const dir = changeOf(item);
  if (!dir || item.price === null || item.previous === null) return <span className={dark ? 'text-white/40' : 'text-ink/65'}>—</span>;

  const pct = item.previous === 0 ? 0 : ((item.price - item.previous) / item.previous) * 100;
  const icon = dir === 'up' ? ArrowUp : dir === 'down' ? ArrowDown : Minus;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-semibold',
        dir === 'up' && (dark ? 'text-amber-300' : 'text-warning'),
        dir === 'down' && (dark ? 'text-emerald-300' : 'text-success'),
        dir === 'flat' && (dark ? 'text-white/50' : 'text-ink/65'),
      )}
    >
      <DirIcon icon={icon} className="h-3.5 w-3.5" />
      <span className="sr-only">{t(dir)}</span>
      {dir !== 'flat' && <span className="num">{formatNumber(Math.abs(pct), locale, { maximumFractionDigits: 1 })}%</span>}
    </span>
  );
}
