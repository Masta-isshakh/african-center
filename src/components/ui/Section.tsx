import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

export function Eyebrow({ children, dark, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return <p className={cn('eyebrow', dark && 'eyebrow-dark', className)}>{children}</p>;
}

interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  dark?: boolean;
  align?: 'start' | 'center';
  as?: 'h1' | 'h2';
  id?: string;
  className?: string;
}

/** Eyebrow → display heading → thin gold rule (from the letterhead) → lead. */
export function SectionHeading({ eyebrow, title, lead, dark, align = 'start', as: Tag = 'h2', id, className }: SectionHeadingProps) {
  const center = align === 'center';
  return (
    <Reveal className={cn('max-w-3xl', center && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <Tag id={id} className={cn('mt-4 text-display-xl font-bold', dark ? 'text-white' : 'text-navy-800')}>
        {title}
      </Tag>
      <span aria-hidden="true" className={cn('gold-rule mt-6', center && 'mx-auto')} />
      {lead && <p className={cn('mt-6 text-lg', dark ? 'text-white/75' : 'text-ink/75')}>{lead}</p>}
    </Reveal>
  );
}

interface SectionProps {
  id?: string;
  tone?: 'sand' | 'white' | 'dark' | 'topo';
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}

export function Section({ id, tone = 'sand', className, children, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'cv-auto relative py-20 sm:py-24 lg:py-32',
        tone === 'sand' && 'bg-sand',
        tone === 'white' && 'bg-white',
        tone === 'topo' && 'surface-topo',
        tone === 'dark' && 'surface-dark',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Chip({ children, tone = 'light', className }: { children: ReactNode; tone?: 'light' | 'dark' | 'gold'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        tone === 'light' && 'border border-mist bg-white text-navy-700',
        tone === 'dark' && 'border border-white/15 bg-white/5 text-white/85',
        tone === 'gold' && 'border border-gold-500/40 bg-gold-50 text-gold-800',
        className,
      )}
    >
      {children}
    </span>
  );
}
