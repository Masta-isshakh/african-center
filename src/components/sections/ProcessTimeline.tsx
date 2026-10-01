'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useScroll, useSpring } from 'framer-motion';
import { MotionScope } from '@/components/motion/MotionScope';
import type { StepSlot } from '@/lib/media';
import { Media } from '@/components/ui/Media';
import { cn, pad2 } from '@/lib/utils';

export interface TimelineStep {
  slot: StepSlot;
  title: string;
  body: string;
  alt: string;
  label: string;
}

/**
 * Centre line fills with scroll (scaleY); a sticky badge on the line morphs to the active step number;
 * steps alternate sides on desktop (mirrored automatically in RTL) and stack beside the line on mobile.
 */
function ProcessTimelineInner({ steps, progressLabel }: { steps: TimelineStep[]; progressLabel: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 60%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>('[data-step]');
    if (!items) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.step)));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* track + fill */}
      <div aria-hidden="true" className="absolute inset-y-0 start-5 w-px bg-white/10 lg:start-1/2">
        <m.div style={{ scaleY }} className="h-full w-full origin-top bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600" />
      </div>

      {/* sticky active-step badge, riding the line */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-1/2 hidden -translate-x-1/2 lg:block rtl:translate-x-1/2">
        <div className="sticky top-[46vh] grid h-20 w-20 place-items-center rounded-full border border-gold-500/60 bg-charcoal shadow-[0_0_0_8px_rgba(16,20,24,1),0_0_40px_rgba(201,154,46,.25)]">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.span
              key={active}
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.35 }}
              className="num text-gold-gradient font-display text-3xl font-bold"
            >
              {pad2(active + 1)}
            </m.span>
          </AnimatePresence>
        </div>
      </div>

      <ol ref={listRef} aria-label={progressLabel} className="relative space-y-16 lg:space-y-28">
        {steps.map((step, i) => {
          const even = i % 2 === 0;
          return (
            <li key={step.slot} data-step={i} className="relative grid items-center gap-6 ps-14 lg:grid-cols-2 lg:gap-28 lg:ps-0">
              {/* mobile node */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute start-5 top-1 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border text-xs font-bold transition-colors duration-500 lg:hidden rtl:translate-x-1/2',
                  i <= active ? 'border-gold-500 bg-gold-500 text-navy-950' : 'border-white/20 bg-charcoal text-white/60',
                )}
              >
                <span className="num">{pad2(i + 1)}</span>
              </span>

              <m.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={cn('lg:row-start-1', even ? 'lg:col-start-1 lg:text-end' : 'lg:col-start-2')}
              >
                <p className="eyebrow eyebrow-dark">{step.label}</p>
                <h3 className="mt-3 font-display text-display-lg font-bold text-white">{step.title}</h3>
                <p className={cn('mt-4 max-w-md text-white/70', even && 'lg:ms-auto')}>{step.body}</p>
              </m.div>

              <m.div
                initial={{ opacity: 0, scale: 0.82 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={cn('w-40 sm:w-48 lg:row-start-1 lg:w-60', even ? 'lg:col-start-2' : 'lg:col-start-1 lg:justify-self-end')}
              >
                <div className="relative rounded-full border border-gold-500/30 p-2">
                  <Media slot={step.slot} alt={step.alt} aspect={1} className="rounded-full" sizes="240px" />
                </div>
              </m.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Framer Motion is scoped to this component (see MotionScope). */
export function ProcessTimeline(props: { steps: TimelineStep[]; progressLabel: string }) {
  return (
    <MotionScope>
      <ProcessTimelineInner {...props} />
    </MotionScope>
  );
}
