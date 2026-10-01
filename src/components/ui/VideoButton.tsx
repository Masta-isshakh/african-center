'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Play, X } from 'lucide-react';
import { media, type MediaSlot } from '@/lib/media';
import { buttonClasses, type ButtonVariant } from './Button';
import { DirIcon } from './DirIcon';

interface Props {
  slot: Extract<MediaSlot, 'ownerVideo' | 'contractorVideo'>;
  label: string;
  title: string;
  /** Where to send people while the video slot is empty (e.g. the process timeline). */
  fallbackHref: string;
  variant?: ButtonVariant;
}

/** "Watch" CTA: opens the video in a modal when the slot is filled, otherwise jumps to `fallbackHref`. */
export function VideoButton({ slot, label, title, fallbackHref, variant = 'secondary' }: Props) {
  const t = useTranslations('video');
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const src = media[slot];

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const content = (
    <>
      <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-500 text-navy-950">
        <DirIcon icon={Play} flip className="h-3.5 w-3.5 fill-current" />
      </span>
      {label}
    </>
  );

  if (!src) {
    return (
      <a href={fallbackHref} className={buttonClasses(variant, 'lg', 'ps-3')}>
        {content}
      </a>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClasses(variant, 'lg', 'ps-3')} aria-haspopup="dialog">
        {content}
      </button>
      {open && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="rise-in fixed inset-0 z-[70] grid place-items-center bg-navy-950/90 p-4 backdrop-blur-md"
            style={{ animationDuration: '300ms' }}
            onClick={() => setOpen(false)}
            data-lenis-prevent
          >
            <div className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-black shadow-glass" onClick={(e) => e.stopPropagation()}>
              <video src={src} controls autoPlay playsInline className="aspect-video w-full" />
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('close')}
                className="absolute end-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-navy-950/80 text-white hover:bg-navy-800"
              >
                <DirIcon icon={X} className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
    </>
  );
}
