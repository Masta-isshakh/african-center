import Image from 'next/image';
import { brand } from '@/lib/brand';
import { media, mediaSpecs } from '@/lib/media';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface WordmarkProps {
  locale: Locale;
  /** `light` for dark backgrounds */
  tone?: 'navy' | 'light';
  /**
   * `compact` (header, menu): emblem + the name set in type — the square lockup is unreadable at 48px.
   * `full` (footer): the complete logo lockup.
   */
  variant?: 'compact' | 'full';
  className?: string;
  label: string;
}

/** Company logo. Uses the logo files from the media manifest, falling back to the typeset letterhead lockup. */
export function Wordmark({ locale, tone = 'navy', variant = 'compact', className, label }: WordmarkProps) {
  const main = tone === 'light' ? 'text-white' : 'text-navy-700';
  const sub = tone === 'light' ? 'text-gold-300' : 'text-gold-700';

  if (variant === 'full') {
    const slot = tone === 'light' ? 'logoWhite' : 'logoFull';
    const file = media[slot];
    if (file) {
      return (
        <span className={cn('relative block w-48 sm:w-56', className)} style={{ aspectRatio: mediaSpecs[slot].aspect }}>
          <Image src={file} alt={label} fill sizes="224px" className="object-contain" />
        </span>
      );
    }
  }

  const arabic = (
    <span
      lang="ar"
      dir="rtl"
      className={cn(
        'block font-display font-bold leading-tight',
        main,
        variant === 'full' ? 'text-xl' : 'text-[calc(0.8125rem*var(--fs))] min-[400px]:text-[calc(0.9rem*var(--fs))] sm:text-[calc(1.05rem*var(--fs))]',
      )}
    >
      {brand.name.ar}
    </span>
  );
  const english = (
    <span lang="en" dir="ltr" className="block">
      <span
        className={cn(
          'block font-display font-bold leading-none tracking-[0.02em]',
          main,
          variant === 'full' ? 'text-[calc(1.6rem*var(--fs))]' : 'text-[calc(1.05rem*var(--fs))] sm:text-[calc(1.2rem*var(--fs))]',
        )}
      >
        {brand.wordmark.line1}
      </span>
      <span
        className={cn(
          'mt-1 block font-display text-[calc(9px*var(--fs))] font-semibold uppercase tracking-[0.18em]',
          variant === 'full' ? 'sm:text-[calc(11px*var(--fs))]' : 'sm:text-[calc(9.5px*var(--fs))]',
          sub,
        )}
      >
        {brand.wordmark.line2}
      </span>
    </span>
  );

  if (variant === 'full') {
    return (
      <span className={cn('inline-flex flex-col gap-2', className)} aria-label={label} role="img">
        {arabic}
        <span aria-hidden="true" className="gold-rule w-full opacity-60" />
        {english}
      </span>
    );
  }

  const text =
    locale === 'ar' ? (
      <span className="flex min-w-0 flex-col gap-0.5">
        {arabic}
        <span className={cn('block font-display text-[calc(9px*var(--fs))] font-semibold uppercase tracking-[0.18em]', sub)} dir="ltr">
          {brand.wordmark.line1}
        </span>
      </span>
    ) : (
      english
    );

  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2.5', className)} aria-label={label} role="img">
      {media.logoMark && (
        <span className="relative block h-10 w-10 shrink-0 sm:h-12 sm:w-12">
          <Image src={media.logoMark} alt="" fill sizes="48px" priority className="object-contain" />
        </span>
      )}
      {text}
    </span>
  );
}
