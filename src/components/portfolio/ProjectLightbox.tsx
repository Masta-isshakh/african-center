'use client';

import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, m, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryImage } from '@/content/projects.types';
import { DirIcon } from '@/components/ui/DirIcon';
import { ProjectImage } from './ProjectImage';

interface Props {
  items: GalleryImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

/** Modal viewer: ←/→ follow reading direction, Esc closes, focus is trapped, swipe on touch. */
export function ProjectLightbox({ items, index, onIndex, onClose }: Props) {
  const t = useTranslations('portfolio.lightbox');
  const rtl = useLocale() === 'ar';
  const ref = useRef<HTMLDivElement>(null);
  const item = items[index];
  const go = (delta: number) => onIndex((index + delta + items.length) % items.length);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    return () => {
      document.documentElement.style.overflow = '';
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // In Arabic the "next" image sits to the left, so the arrow keys swap.
      if (e.key === 'ArrowRight') go(rtl ? -1 : 1);
      if (e.key === 'ArrowLeft') go(rtl ? 1 : -1);
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 60) return;
    const towardStart = rtl ? info.offset.x > 0 : info.offset.x < 0;
    go(towardStart ? 1 : -1);
  };

  return (
    <m.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={t('label')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent
      className="fixed inset-0 z-[70] flex flex-col bg-navy-950/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="container-site flex h-16 shrink-0 items-center justify-between text-white" onClick={(e) => e.stopPropagation()}>
        <p className="num text-sm text-white/70">{t('counter', { current: String(index + 1), total: String(items.length) })}</p>
        <button data-autofocus type="button" onClick={onClose} aria-label={t('close')} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 hover:border-gold-400/60">
          <DirIcon icon={X} className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
        <AnimatePresence mode="wait" initial={false}>
          <m.figure
            key={item.key}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={onDragEnd}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-6xl touch-pan-y flex-col items-center"
          >
            {/* The box is sized from the image's aspect so the whole render stays inside 76vh without cropping. */}
            <div className="relative w-full overflow-hidden rounded-xl bg-navy-900" style={{ maxWidth: `min(100%, calc(76vh * ${(item.width / item.height).toFixed(4)}))` }}>
              <ProjectImage
                image={item}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(min-width:1280px) 1152px, 95vw"
                placeholder="blur"
                blurDataURL={item.blur}
                priority
                draggable={false}
                className="h-auto w-full select-none"
              />
            </div>
            <figcaption className="mt-4 text-center text-white">
              <span className="font-semibold">{item.alt}</span>
            </figcaption>
          </m.figure>
        </AnimatePresence>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          aria-label={t('prev')}
          className="absolute start-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-navy-950/60 text-white hover:border-gold-400/60 sm:start-6"
        >
          <DirIcon icon={ChevronLeft} flip className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          aria-label={t('next')}
          className="absolute end-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-navy-950/60 text-white hover:border-gold-400/60 sm:end-6"
        >
          <DirIcon icon={ChevronRight} flip className="h-6 w-6" />
        </button>
      </div>
    </m.div>
  );
}
