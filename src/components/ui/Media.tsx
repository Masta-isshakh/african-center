import Image from 'next/image';
import { ImageIcon, Film, Shapes, type LucideIcon } from 'lucide-react';
import { media, mediaSpecs, type MediaSlot, type MediaKind } from '@/lib/media';
import { DirIcon } from './DirIcon';
import { cn } from '@/lib/utils';

const kindIcon: Record<MediaKind, LucideIcon> = { image: ImageIcon, video: Film, logo: Shapes };

interface BoxProps {
  slot: MediaSlot;
  /** Overrides the slot's recommended aspect ratio (width / height). */
  aspect?: number;
  /** Fill the positioned parent instead of reserving an aspect box. */
  fill?: boolean;
  className?: string;
}

interface PlaceholderProps extends BoxProps {
  label?: string;
  icon?: LucideIcon;
}

/** Shimmering stand-in that reserves the exact box the final asset will occupy (zero layout shift). */
export function MediaPlaceholder({ slot, aspect, fill, className, label, icon }: PlaceholderProps) {
  const spec = mediaSpecs[slot];
  return (
    <div
      role="presentation"
      className={cn('shimmer-panel relative isolate overflow-hidden', fill ? 'absolute inset-0' : 'w-full', className)}
      style={fill ? undefined : { aspectRatio: aspect ?? spec.aspect }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
        <span className="grid h-10 w-10 place-items-center rounded-full border border-gold-400/40 bg-navy-950/40 text-gold-300">
          <DirIcon icon={icon ?? kindIcon[spec.kind]} className="h-4 w-4" />
        </span>
        <span className="font-display text-[calc(11px*var(--fs))] font-semibold uppercase tracking-[0.18em] text-white/70" dir="ltr">
          {label ?? slot}
        </span>
        <span className="num font-display text-[calc(10px*var(--fs))] tracking-wider text-white/40">{spec.size}</span>
      </div>
    </div>
  );
}

interface MediaProps extends PlaceholderProps {
  alt: string;
  sizes?: string;
  priority?: boolean;
  imgClassName?: string;
}

/** Renders the slot's asset when present, otherwise its placeholder — same box either way. */
export function Media({ slot, alt, aspect, fill, sizes = '100vw', priority, className, imgClassName, label, icon }: MediaProps) {
  const src = media[slot];
  if (!src) return <MediaPlaceholder slot={slot} aspect={aspect} fill={fill} className={className} label={label} icon={icon} />;

  const spec = mediaSpecs[slot];
  return (
    <div
      className={cn('relative overflow-hidden bg-navy-900', fill ? 'absolute inset-0' : 'w-full', className)}
      style={fill ? undefined : { aspectRatio: aspect ?? spec.aspect }}
    >
      {spec.kind === 'video' ? (
        <video
          src={src}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-label={alt}
          className={cn('absolute inset-0 h-full w-full object-cover', imgClassName)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className={cn(spec.kind === 'logo' ? 'object-contain' : 'object-cover', imgClassName)}
        />
      )}
    </div>
  );
}
