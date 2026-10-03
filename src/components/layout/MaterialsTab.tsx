'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { BarChart3, X, ArrowRight } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { materials, panelMaterialIds, pickMaterials, hasPrices } from '@/content/materials';
import { media } from '@/lib/media';
import { track } from '@/lib/analytics';
import { DirIcon } from '@/components/ui/DirIcon';
import { Freshness } from '@/components/ui/Freshness';
import { PriceChange, usePriceFormatter } from '@/components/ui/PriceChange';

/** Vertical tab docked to the inline-end edge; slides out a compact price panel. */
export function MaterialsTab() {
  const t = useTranslations('materials');
  const tc = useTranslations('common');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // mounted → in the DOM; shown → slid in. Lets the panel slide out before unmounting.
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const fmt = usePriceFormatter();
  const items = pickMaterials(materials, panelMaterialIds);
  const published = hasPrices(materials);

  useEffect(() => {
    if (!open || !mounted) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, mounted]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const id = window.setTimeout(() => setMounted(false), 400);
    return () => window.clearTimeout(id);
  }, [open]);

  if (pathname.startsWith('/materials') || pathname.startsWith('/start')) return null;

  const toggle = () => {
    if (!open) track('materials_tab_opened', { placement: 'side_tab' });
    setOpen((v) => !v);
  };

  return (
    <div className="hidden md:block">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="materials-panel"
        aria-label={open ? t('closePanel') : t('openPanel')}
        className="fixed end-0 top-1/2 z-40 -translate-y-1/2 rounded-s-xl border border-e-0 border-gold-500/40 bg-navy-950/90 px-2.5 py-4 text-xs font-semibold text-white shadow-lift backdrop-blur-md transition-colors hover:bg-navy-800"
      >
        {/* writing-mode lives on the inner span: on the button it would remap its own `end` positioning */}
        <span className="flex items-center gap-2" style={{ writingMode: 'vertical-rl' }}>
        {media.materialsIcon ? (
          <Image src={media.materialsIcon} alt="" width={16} height={16} className="h-4 w-4" />
        ) : (
          <DirIcon icon={BarChart3} className="h-4 w-4 rotate-90 text-gold-400" />
        )}
        {t('tabLabel')}
        </span>
      </button>

      {mounted && (
          <aside
            ref={panelRef}
            id="materials-panel"
            tabIndex={-1}
            aria-label={t('panelTitle')}
            data-lenis-prevent
            className={`fixed end-0 top-1/2 z-50 w-[22rem] -translate-y-1/2 transition-transform duration-500 ease-out-expo ${shown ? 'translate-x-0' : 'translate-x-[105%] rtl:-translate-x-[105%]'} rounded-s-2xl border border-e-0 border-gold-500/30 bg-navy-950/95 p-6 text-white shadow-glass outline-none backdrop-blur-xl`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow eyebrow-dark">{t('eyebrow')}</p>
                <h2 className="mt-2 font-body text-lg font-semibold">{t('panelTitle')}</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={t('closePanel')} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:border-gold-400/60">
                <DirIcon icon={X} className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3">
              <Freshness updatedAt={materials.updatedAt} dark />
            </div>
            <table className="mt-4 w-full text-sm">
              <caption className="sr-only">{t('table.caption')}</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">{t('table.material')}</th>
                  <th scope="col">{t('table.price', { currency: tc('currency') })}</th>
                  <th scope="col">{t('table.change')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {items.map((item) => (
                  <tr key={item.id}>
                    <th scope="row" className="py-2.5 text-start font-medium text-white/85">
                      {t(`items.${item.id}`)}
                      <span className="block text-[calc(11px*var(--fs))] font-normal text-white/45">{t('perUnit', { unit: t(`units.${item.unit}`) })}</span>
                    </th>
                    <td className="py-2.5 text-end font-semibold text-gold-300">
                      {item.price !== null ? <span className="num">{fmt(item.price)}</span> : <span className="text-xs font-medium text-white/45">{t('pending')}</span>}
                    </td>
                    <td className="w-16 py-2.5 text-end">
                      <PriceChange item={item} dark />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!published && <p className="mt-4 rounded-lg bg-white/5 p-3 text-xs text-white/70">{t('pendingBody')}</p>}
            {materials.sample && <p className="mt-3 text-[calc(11px*var(--fs))] text-gold-300/80">{tc('sampleNote')}</p>}
            <p className="mt-4 text-[calc(11px*var(--fs))] text-white/50">
              {t('source')} · {tc('currency')}
            </p>
            <Link href="/materials" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300">
              {t('viewAll')}
              <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
            </Link>
          </aside>
        )}
    </div>
  );
}
