import Image from 'next/image';
import { brand } from '@/lib/brand';
import { media, mediaSpecs } from '@/lib/media';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface WordmarkProps {
  locale: Locale;
  /** `light` for dark backgrounds */
  tone?: 'navy' | 'light';
  /** `compact` shows the active-locale lockup only; `full` stacks Arabic over English as on the letterhead. */
  variant?: 'compact' | 'full';
  className?: string;
  label: string;
}

/**
 * The letterhead lockup. Uses the logo files from the media manifest when present,
 * otherwise the typeset wordmark: Bodoni Moda + Inter (English), Cairo 800 (Arabic).
 */
export function Wordmark({ locale, tone = 'navy', variant = 'compact', className, label }: WordmarkProps) {
  const file = tone === 'light' ? media.logoWhite : media.logoFull;
  if (file) {
    const spec = mediaSpecs[tone === 'light' ? 'logoWhite' : 'logoFull'];
    return (
      <span className={cn('relative block h-11', className)} style={{ aspectRatio: spec.aspect }}>
        <Image src={file} alt={label} fill sizes="240px" className="object-contain" priority />
      </span>
    );
  }

  const main = tone === 'light' ? 'text-white' : 'text-navy-700';
  const sub = tone === 'light' ? 'text-gold-300' : 'text-gold-700';

  const arabic = (
    <span lang="ar" dir="rtl" className={cn('block font-display font-extrabold leading-tight', main, variant === 'full' ? 'text-xl' : 'text-[calc(0.8125rem*var(--fs))] min-[400px]:text-[calc(0.9rem*var(--fs))] sm:text-[calc(1.05rem*var(--fs))]')}>
      {brand.name.ar}
    </span>
  );
  const english = (
    <span lang="en" dir="ltr" className="block">
      <span className={cn('block font-display font-bold leading-none tracking-[0.02em]', main, variant === 'full' ? 'text-[calc(1.6rem*var(--fs))]' : 'text-[calc(1.05rem*var(--fs))] sm:text-[calc(1.2rem*var(--fs))]')}>
        {brand.wordmark.line1}
      </span>
      <span className={cn('mt-1 block font-display text-[calc(9px*var(--fs))] font-semibold uppercase tracking-[0.18em] sm:text-[calc(11px*var(--fs))]', variant === 'full' ? 'sm:text-[calc(11px*var(--fs))]' : 'sm:text-[calc(9.5px*var(--fs))]', sub)}>
        {brand.wordmark.line2}
      </span>
    </span>
  );

  return (
    <span className={cn('inline-flex flex-col', variant === 'full' ? 'gap-2' : 'gap-0.5', className)} aria-label={label} role="img">
      {variant === 'full' ? (
        <>
          {arabic}
          <span aria-hidden="true" className="gold-rule w-full opacity-60" />
          {english}
        </>
      ) : locale === 'ar' ? (
        <>
          {arabic}
          <span className={cn('block font-display text-[calc(9px*var(--fs))] font-semibold uppercase tracking-[0.18em]', sub)} dir="ltr">
            {brand.wordmark.line1}
          </span>
        </>
      ) : (
        english
      )}
    </span>
  );
}
