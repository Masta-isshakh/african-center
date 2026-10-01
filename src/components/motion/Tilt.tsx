'use client';

import { useRef, type ReactNode, type PointerEvent } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { useLocale } from 'next-intl';
import { MotionScope } from './MotionScope';

/** Hover tilt for cards (up to 6°), mouse only. Plain transforms + a CSS transition. */
export function Tilt({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 2 * max).toFixed(2)}deg) rotateY(${(px * 2 * max).toFixed(2)}deg)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className={`transition-transform duration-300 ease-out ${className ?? ''}`}>
      {children}
    </div>
  );
}

function ScrollTiltInner({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rtl = useLocale() === 'ar';
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const rotateY = useTransform(scrollYProgress, [0, 1], [rtl ? -18 : 18, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, 0]);
  return (
    <m.div ref={ref} style={{ rotateY, rotateX, transformPerspective: 1200 }} className={className}>
      {children}
    </m.div>
  );
}

/** Perspective tilt (rotateY 18° toward inline-start) that straightens to 0° as it scrolls into view. */
export function ScrollTilt(props: { children: ReactNode; className?: string }) {
  return (
    <MotionScope>
      <ScrollTiltInner {...props} />
    </MotionScope>
  );
}
