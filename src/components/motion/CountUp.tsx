'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Counts from 0 to `target` with easeOutExpo once `active` turns true. Returns the current value and progress (0–1). */
export function useCountUp(target: number, active: boolean, duration = 1600) {
  const reduce = useReducedMotion();
  const [state, setState] = useState({ value: 0, progress: 0 });

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setState({ value: target, progress: 1 });
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = easeOutExpo(t);
      setState({ value: target * e, progress: e });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduce]);

  return state;
}

/** A stat with an animated gold progress ring (stroke-dashoffset) around it. */
export function StatCounter({ target, label, format }: { target: number; label: string; format: (n: number) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const { value, progress } = useCountUp(target, inView);
  const C = 2 * Math.PI * 46;

  return (
    <div ref={ref} className="flex items-center gap-5">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-navy-100" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#C99A2E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
          />
        </svg>
      </div>
      <div>
        <p className="num font-display text-display-lg font-bold text-navy-800">{format(Math.round(value))}</p>
        <p className="mt-1 text-sm text-ink/70">{label}</p>
      </div>
    </div>
  );
}
