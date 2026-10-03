'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { media, mediaSpecs } from '@/lib/media';
import { BlueprintVilla } from '@/components/ui/BlueprintVilla';

/**
 * Hero background: priority poster with an 18s Ken Burns and 12px scroll parallax (plain rAF, no
 * animation library); the video loads only after the page has finished loading, on larger screens
 * with a good connection. Falls back to the blueprint motif.
 */
export function HeroMedia({ alt }: { alt: string }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = layerRef.current;
    if (!el || reduce) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 800) * (12 / 800);
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    // The loop is decorative: skip it on phones, data-saver and slow connections (the poster stays).
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const constrained = conn?.saveData || (conn?.effectiveType && conn.effectiveType !== '4g');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!media.heroVideo || reduce || constrained || !window.matchMedia('(min-width: 768px)').matches) return;
    const start = () => setLoadVideo(true);
    if (document.readyState === 'complete') {
      const id = window.setTimeout(start, 400);
      return () => window.clearTimeout(id);
    }
    window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, []);

  if (!media.heroPoster && !media.heroVideo) {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <BlueprintVilla className="absolute -bottom-6 end-[-8%] w-[min(1100px,120%)] opacity-[.22] sm:end-[-4%] lg:end-0 lg:w-[62%] lg:opacity-30" />
        <span className="absolute bottom-6 end-4 hidden rounded-full border border-white/10 bg-navy-950/50 px-3 py-1 font-display text-[calc(10px*var(--fs))] uppercase tracking-[0.18em] text-white/35 lg:block" dir="ltr">
          heroPoster · {mediaSpecs.heroPoster.size}
        </span>
      </div>
    );
  }

  return (
    <div ref={layerRef} className="absolute -inset-y-4 inset-x-0 overflow-hidden will-change-transform" aria-hidden={media.heroPoster ? undefined : true}>
      {media.heroPoster && <Image src={media.heroPoster} alt={alt} fill priority sizes="100vw" className="animate-ken-burns object-cover" />}
      {media.heroVideo && loadVideo && (
        <video src={media.heroVideo} muted loop playsInline autoPlay preload="none" className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  );
}
