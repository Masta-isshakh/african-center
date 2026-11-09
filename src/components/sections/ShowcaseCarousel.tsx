'use client';

import { useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Box, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { ShowcaseCard } from '@/content/showcase';
import { ProjectImage } from '@/components/portfolio/ProjectImage';
import { DirIcon } from '@/components/ui/DirIcon';

/** Horizontal snap carousel of project renders with mouse drag-to-scroll; each card opens its project. */
export default function ShowcaseCarousel({ items }: { items: ShowcaseCard[] }) {
  const t = useTranslations('showcase');
  const rtl = useLocale() === 'ar';
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
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
    suppressClick.current = false; // a drag that ended off a card must not eat this gesture's click
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
    // a drag must not count as a click on the card underneath
    suppressClick.current = Boolean(drag.current?.moved);
    drag.current = null;
    setDragging(false);
  };
  const onCardClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (suppressClick.current) {
      e.preventDefault();
      suppressClick.current = false;
    }
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
        // Bleeds to the viewport edge: the site container is 95% wide, so its gutter is 2.5/95 of the container.
        // scroll-padding (2.5% of the scrollport = the same gutter) makes snap positions align cards with the container edge.
        className={`no-scrollbar -mx-[2.6316%] flex gap-5 overflow-x-auto px-[2.6316%] pb-2 scroll-px-[2.5%] ${dragging ? 'cursor-grabbing select-none' : 'cursor-grab snap-x snap-mandatory'}`}
      >
        {items.map((item) => (
          <li key={item.key} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]">
            <Link
              href={item.href}
              onClick={onCardClick}
              draggable={false}
              aria-label={t('open', { project: item.projectTitle })}
              className="group relative block aspect-[3/2] overflow-hidden rounded-xl border border-white/10 bg-navy-900"
            >
              <ProjectImage
                image={item.image}
                maxWidth={1440}
                alt={item.alt}
                fill
                sizes="(min-width:1024px) 32vw, (min-width:640px) 46vw, 82vw"
                placeholder="blur"
                blurDataURL={item.image.blur}
                className="pointer-events-none object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-navy-950">
                <DirIcon icon={Box} className="h-3.5 w-3.5" />
                <span dir="ltr">{t('badge')}</span>
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent px-4 pb-4 pt-12 text-white">
                <span className="block text-sm font-semibold">{item.caption}</span>
                <span className="mt-0.5 block text-xs text-white/70">{item.projectTitle}</span>
              </span>
            </Link>
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
