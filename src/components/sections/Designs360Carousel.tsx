'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Rotate3d } from 'lucide-react';
import { designs360 } from '@/content/designs';
import { Media } from '@/components/ui/Media';
import { DirIcon } from '@/components/ui/DirIcon';

/** Horizontal snap carousel with mouse drag-to-scroll and direction-aware arrows. */
export default function Designs360Carousel() {
  const t = useTranslations('designs360');
  const rtl = useLocale() === 'ar';
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  /** +1 = toward the reading end. scrollLeft runs negative in RTL, so the sign flips. */
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * (rtl ? -1 : 1), behavior: 'smooth' });
  };

  const onDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onMove = (e: PointerEvent<HTMLUListElement>) => {
    if (!drag.current || !track.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4 && !drag.current.moved) {
      drag.current.moved = true;
      setDragging(true);
      track.current.setPointerCapture(e.pointerId);
    }
    if (drag.current.moved) track.current.scrollLeft = drag.current.left - dx;
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div>
      <ul
        ref={track}
        aria-label={t('regionLabel')}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={`no-scrollbar -mx-[2.5vw] flex gap-5 overflow-x-auto px-[2.5vw] pb-2 ${dragging ? 'cursor-grabbing select-none' : 'cursor-grab snap-x snap-mandatory'}`}
      >
        {designs360.map((slot, i) => (
          <li key={slot} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]">
            <figure className="group relative overflow-hidden rounded-xl border border-white/10">
              <Media slot={slot} alt={t('alt', { name: t(`views.v${(i + 1) as 1 | 2 | 3 | 4 | 5 | 6}`) })} sizes="(min-width:1024px) 32vw, 80vw" imgClassName="pointer-events-none transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-navy-950">
                <DirIcon icon={Rotate3d} className="h-3.5 w-3.5" />
                <span dir="ltr">{t('badge')}</span>
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 to-transparent px-4 pb-3 pt-8 text-sm font-semibold text-white">
                {t(`views.v${(i + 1) as 1 | 2 | 3 | 4 | 5 | 6}`)}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-white/55">{t('hint')}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label={t('prev')} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-gold-400/70 hover:text-gold-300">
            <DirIcon icon={ChevronLeft} flip className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={t('next')} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-gold-400/70 hover:text-gold-300">
            <DirIcon icon={ChevronRight} flip className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
