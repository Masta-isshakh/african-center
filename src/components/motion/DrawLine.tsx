'use client';

import { useRevealOnce } from './Reveal';
import { cn } from '@/lib/utils';

/** A thin gold rule that draws itself from inline-start when scrolled into view. */
export function DrawLine({ className }: { className?: string }) {
  const ref = useRevealOnce<HTMLDivElement>(0.8);
  return (
    <div ref={ref} aria-hidden="true" data-draw-line className={cn('h-px overflow-hidden', className)}>
      <div className="h-full w-full bg-gradient-to-r from-gold-500/20 via-gold-500 to-gold-500/20" />
    </div>
  );
}
