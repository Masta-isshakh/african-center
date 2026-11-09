'use client';

import { useEffect, useRef } from 'react';
import type { VariantSet } from '@/content/projects.types';
import { ProjectImage } from '@/components/portfolio/ProjectImage';

interface Props {
  /** One of the company's project renders (see content/showcase.ts) */
  image: VariantSet & { blur: string };
  alt: string;
}

/**
 * Hero background: a priority project render with an 18s Ken Burns and 12px scroll parallax
 * (plain rAF, no animation library). Served from the static, content-hashed WebP set, so the
 * LCP image never waits for an image optimiser.
 */
export function HeroMedia({ image, alt }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={layerRef} className="absolute -inset-y-4 inset-x-0 overflow-hidden will-change-transform">
      <ProjectImage image={image} maxWidth={2560} alt={alt} fill priority sizes="100vw" placeholder="blur" blurDataURL={image.blur} className="animate-ken-burns object-cover" />
    </div>
  );
}
