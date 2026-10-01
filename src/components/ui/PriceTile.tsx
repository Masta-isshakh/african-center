import { useTranslations } from 'next-intl';
import type { MaterialPrice } from '@/content/materials';
import { PriceChange, usePriceFormatter } from './PriceChange';

export function PriceTile({ item }: { item: MaterialPrice }) {
  const t = useTranslations();
  const fmt = usePriceFormatter();
  return (
    <div className="card-lift h-full rounded-xl border border-mist bg-white p-5">
      <p className="text-sm font-semibold text-navy-800">{t(`materials.items.${item.id}`)}</p>
      <p className="mt-4 flex items-baseline gap-1.5">
        {item.price !== null ? (
          <>
            <span className="num font-display text-3xl font-bold text-navy-800">{fmt(item.price)}</span>
            <span className="text-xs font-semibold text-gold-700">{t('common.currency')}</span>
          </>
        ) : (
          <span className="font-display text-2xl font-bold text-ink/55">{t('materials.pending')}</span>
        )}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-ink/65">
        <span>{t('materials.perUnit', { unit: t(`materials.units.${item.unit}`) })}</span>
        <PriceChange item={item} />
      </div>
    </div>
  );
}
