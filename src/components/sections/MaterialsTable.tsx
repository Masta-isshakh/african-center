import { useTranslations } from 'next-intl';
import { materials } from '@/content/materials';
import { PriceChange, usePriceFormatter } from '@/components/ui/PriceChange';

/** Full price table. Digits are isolated LTR while columns follow the page direction. */
export function MaterialsTable() {
  const t = useTranslations();
  const fmt = usePriceFormatter();
  return (
    <div className="overflow-x-auto rounded-xl border border-mist bg-white shadow-layered">
      <table className="w-full min-w-[34rem] text-sm">
        <caption className="sr-only">{t('materials.table.caption')}</caption>
        <thead className="bg-navy-950 text-white">
          <tr>
            <th scope="col" className="px-5 py-4 text-start font-semibold">{t('materials.table.material')}</th>
            <th scope="col" className="px-5 py-4 text-start font-semibold">{t('materials.table.unit')}</th>
            <th scope="col" className="px-5 py-4 text-end font-semibold">{t('materials.table.price', { currency: t('common.currency') })}</th>
            <th scope="col" className="px-5 py-4 text-end font-semibold">{t('materials.table.change')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-mist">
          {materials.items.map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-sand/70">
              <th scope="row" className="px-5 py-4 text-start font-semibold text-navy-800">{t(`materials.items.${item.id}`)}</th>
              <td className="px-5 py-4 text-ink/70">{t(`materials.units.${item.unit}`)}</td>
              <td className="px-5 py-4 text-end">
                {item.price !== null ? (
                  <span className="num font-display text-lg font-bold text-navy-800">{fmt(item.price)}</span>
                ) : (
                  <span className="text-xs font-semibold text-ink/65">{t('materials.pending')}</span>
                )}
              </td>
              <td className="px-5 py-4 text-end">
                <PriceChange item={item} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
