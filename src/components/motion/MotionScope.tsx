'use client';

import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig } from 'framer-motion';

const loadFeatures = () => import('./features').then((mod) => mod.default);

/**
 * Framer Motion only for components that need real physics/layout animation (timeline, gallery,
 * sliders, wizards). Pages without them never download the library; features load lazily.
 * `reducedMotion="user"` drops transforms (keeps opacity) for visitors who prefer less motion.
 */
export function MotionScope({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
