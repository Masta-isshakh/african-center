'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'inline-start';
type Tag = 'div' | 'ul' | 'ol' | 'li' | 'span' | 'dl';

/**
 * Adds `data-shown` once `amount` of the element is visible (once only).
 * The animation itself is CSS (globals.css → [data-reveal]), so no motion library ships for it.
 */
export function useRevealOnce<T extends HTMLElement>(amount = 0.25) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-shown', '');
          io.disconnect();
        }
      },
      // Tall elements can never be 25% visible at once — fall back to any intersection.
      { threshold: el.offsetHeight > window.innerHeight * 1.5 ? 0.01 : amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);
  return ref;
}

interface RevealProps {
  children: ReactNode;
  /** `inline-start` slides in from the reading-start edge (left in English, right in Arabic). */
  direction?: Direction;
  /** Delay in ms */
  delay?: number;
  /** Stagger direct <RevealItem> children by 80ms instead of animating this element. */
  stagger?: boolean;
  amount?: number;
  as?: Tag;
  className?: string;
  id?: string;
}

/** Fade + 24px rise + blur-out, once, when 25% is in view. Mirrors automatically in RTL. */
export function Reveal({ children, direction = 'up', delay = 0, stagger, amount = 0.25, as = 'div', className, id }: RevealProps) {
  const ref = useRevealOnce<HTMLElement>(amount);
  const Comp = as as ElementType;
  return (
    <Comp
      ref={ref}
      id={id}
      data-reveal={stagger ? 'group' : direction}
      className={className}
      style={delay ? { ['--reveal-delay' as string]: `${delay}ms` } : undefined}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ children, direction = 'up', as = 'div', className }: Omit<RevealProps, 'stagger' | 'amount' | 'delay' | 'id'>) {
  const Comp = as as ElementType;
  return (
    <Comp data-reveal-item={direction} className={cn(className)}>
      {children}
    </Comp>
  );
}
