'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, m, useReducedMotion, type PanInfo } from 'framer-motion';
import { MotionScope } from '@/components/motion/MotionScope';
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from 'lucide-react';
import { DirIcon } from '@/components/ui/DirIcon';
import { Chip } from '@/components/ui/Section';
import { cn } from '@/lib/utils';

interface Item {
  id: string;
  name: string;
  role: string;
  quote: string;
}

/** Auto-playing (6s), pausable, draggable slider. Paused by default for reduced-motion visitors. */
function TestimonialSliderInner({ items }: { items: Item[] }) {
  const t = useTranslations('testimonials');
  const tc = useTranslations('common');
  const rtl = useLocale() === 'ar';
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (delta: number) => {
      setDir(delta);
      setIndex((i) => (i + delta + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [playing, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 60) return;
    go((rtl ? info.offset.x > 0 : info.offset.x < 0) ? 1 : -1);
  };

  const item = items[index];
  const shift = (rtl ? -1 : 1) * 40;

  return (
    <div aria-roledescription="carousel" aria-label={t('regionLabel')} className="mx-auto max-w-3xl" onMouseEnter={() => setPlaying(false)}>
      <div className="relative min-h-[18rem] overflow-hidden rounded-xl border border-mist bg-white p-8 shadow-layered sm:p-12">
        <DirIcon icon={Quote} flip className="absolute end-8 top-8 h-12 w-12 text-gold-500/20" />
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <m.figure
            key={item.id}
            custom={dir}
            initial={{ opacity: 0, x: dir * shift }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -dir * shift }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={onDragEnd}
            className="cursor-grab touch-pan-y active:cursor-grabbing"
            aria-live={playing ? 'off' : 'polite'}
          >
            <Chip tone="gold">{tc('sampleBadge')}</Chip>
            <blockquote className="mt-6 font-display text-xl leading-relaxed text-navy-800 sm:text-2xl">{item.quote}</blockquote>
            <figcaption className="mt-8">
              <p className="font-semibold text-navy-800">{item.name}</p>
              <p className="text-sm text-ink/70">{item.role}</p>
            </figcaption>
          </m.figure>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex gap-1.5">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              onClick={() => {
                setDir(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={t('goTo', { n: String(i + 1) })}
              aria-current={i === index}
              className={cn('h-2 rounded-full transition-all duration-300', i === index ? 'w-8 bg-gold-500' : 'w-2 bg-navy-200 hover:bg-navy-300')}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? t('pause') : t('play')} className="grid h-10 w-10 place-items-center rounded-full border border-mist bg-white text-navy-700 hover:border-gold-500">
            <DirIcon icon={playing ? Pause : Play} className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => go(-1)} aria-label={t('prev')} className="grid h-10 w-10 place-items-center rounded-full border border-mist bg-white text-navy-700 hover:border-gold-500">
            <DirIcon icon={ChevronLeft} flip className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t('next')} className="grid h-10 w-10 place-items-center rounded-full border border-mist bg-white text-navy-700 hover:border-gold-500">
            <DirIcon icon={ChevronRight} flip className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-ink/65">{tc('sampleNote')}</p>
    </div>
  );
}

/** Framer Motion is scoped to this component (see MotionScope). */
export function TestimonialSlider(props: { items: Item[] }) {
  return (
    <MotionScope>
      <TestimonialSliderInner {...props} />
    </MotionScope>
  );
}
