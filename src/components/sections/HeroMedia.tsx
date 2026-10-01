'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { MotionScope } from '@/components/motion/MotionScope';
import { media, mediaSpecs } from '@/lib/media';
import { BlueprintVilla } from '@/components/ui/BlueprintVilla';

/**
 * Hero background: priority poster with an 18s Ken Burns and 12px scroll parallax;
 * the video loads only after the page has finished loading. Falls back to the blueprint motif.
 */
function HeroMediaInner({ alt }: { alt: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 12]);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    // The loop is decorative: skip it on phones, data-saver and slow connections (the poster stays).
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const constrained = conn?.saveData || (conn?.effectiveType && conn.effectiveType !== '4g');
    if (!media.heroVideo || reduce || constrained || !window.matchMedia('(min-width: 768px)').matches) return;
    const start = () => setLoadVideo(true);
    if (document.readyState === 'complete') {
      const id = window.setTimeout(start, 400);
      return () => window.clearTimeout(id);
    }
    window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, [reduce]);

  if (!media.heroPoster && !media.heroVideo) {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <BlueprintVilla className="absolute -bottom-6 end-[-8%] w-[min(1100px,120%)] opacity-[.22] sm:end-[-4%] lg:end-0 lg:w-[62%] lg:opacity-30" />
        <span className="absolute bottom-6 end-4 hidden rounded-full border border-white/10 bg-navy-950/50 px-3 py-1 font-wordmark-sans text-[10px] uppercase tracking-[0.18em] text-white/35 lg:block" dir="ltr">
          heroPoster · {mediaSpecs.heroPoster.size}
        </span>
      </div>
    );
  }

  return (
    <m.div style={{ y }} className="absolute -inset-y-4 inset-x-0 overflow-hidden" aria-hidden={media.heroPoster ? undefined : true}>
      {media.heroPoster && (
        <Image src={media.heroPoster} alt={alt} fill priority sizes="100vw" className="animate-ken-burns object-cover" />
      )}
      {media.heroVideo && loadVideo && (
        <video src={media.heroVideo} muted loop playsInline autoPlay preload="none" className="absolute inset-0 h-full w-full object-cover" />
      )}
    </m.div>
  );
}

/** Framer Motion is scoped to this component (see MotionScope). */
export function HeroMedia(props: { alt: string }) {
  return (
    <MotionScope>
      <HeroMediaInner {...props} />
    </MotionScope>
  );
}
