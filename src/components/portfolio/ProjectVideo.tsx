'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Play } from 'lucide-react';
import type { GalleryImage } from '@/content/projects.types';
import { DirIcon } from '@/components/ui/DirIcon';
import { track } from '@/lib/analytics';
import { ProjectImage } from './ProjectImage';

interface Props {
  project: string;
  title: string;
  sources: { src: string; width: number; height: number }[];
  poster: GalleryImage;
  duration: number;
}

/**
 * Poster + play button; the <video> element (and its bytes) only exist after a click, so the page itself
 * never downloads the clip. Phones and data-saver connections get the 720p rendition first.
 */
export function ProjectVideo({ project, title, sources, poster, duration }: Props) {
  const t = useTranslations('portfolio.video');
  const [playing, setPlaying] = useState(false);
  const [ordered, setOrdered] = useState(sources);

  const play = () => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const constrained = conn?.saveData || (conn?.effectiveType && conn.effectiveType !== '4g');
    const small = window.matchMedia('(max-width: 767px)').matches;
    const byHeight = [...sources].sort((a, b) => b.height - a.height);
    setOrdered(small || constrained ? byHeight.reverse() : byHeight);
    setPlaying(true);
    track('project_video_played', { project });
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black shadow-glass">
      <div className="relative aspect-video">
        {playing ? (
          <video controls autoPlay playsInline preload="auto" poster={poster.src} aria-label={t('label', { title })} className="absolute inset-0 h-full w-full">
            {ordered.map((s) => (
              <source key={s.src} src={s.src} type="video/mp4" />
            ))}
            {t('unsupported')}
          </video>
        ) : (
          <button type="button" onClick={play} aria-label={t('play')} className="group absolute inset-0 block w-full text-start">
            <ProjectImage
              image={poster}
              maxWidth={2048}
              alt={poster.alt}
              fill
              sizes="(min-width:1024px) 62vw, 95vw"
              placeholder="blur"
              blurDataURL={poster.blur}
              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-navy-950/30 transition-colors group-hover:bg-navy-950/15" />
            <span aria-hidden="true" className="absolute start-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rtl:translate-x-1/2">
              <span className="absolute inset-0 rounded-full bg-gold-500/70 animate-pulse-ring" />
              <span className="relative grid h-20 w-20 place-items-center rounded-full bg-gold-500 text-navy-950 shadow-glow transition-transform duration-300 group-hover:scale-105">
                <DirIcon icon={Play} flip className="ms-1 h-8 w-8 fill-current" />
              </span>
            </span>
            <span className="num absolute bottom-4 start-4 rounded-full border border-white/20 bg-navy-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {t('duration', { seconds: duration })}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
