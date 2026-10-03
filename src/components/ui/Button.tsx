'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { Magnetic } from '@/components/motion/Magnetic';
import { track, type AnalyticsEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'ghostDark' | 'navy';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out-expo disabled:pointer-events-none disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary:
    'btn-sheen bg-gold-500 text-navy-950 shadow-[0_8px_24px_-10px_rgba(201,154,46,.7)] hover:bg-gold-400 hover:shadow-[0_14px_32px_-12px_rgba(201,154,46,.8)] active:translate-y-px',
  secondary: 'border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-gold-400/70 hover:bg-white/10',
  outline: 'border border-navy-700/25 bg-transparent text-navy-700 hover:border-gold-600 hover:text-navy-900',
  ghost: 'text-navy-700 hover:bg-navy-700/5',
  ghostDark: 'text-white/85 hover:bg-white/10 hover:text-white',
  navy: 'bg-navy-700 text-white hover:bg-navy-600',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[calc(0.9375rem*var(--fs))]',
  lg: 'h-14 px-8 text-base',
};

export const buttonClasses = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) =>
  cn(base, variants[variant], sizes[size], className);

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Magnetic hover (fine pointers only). Defaults to true for primary buttons. */
  magnetic?: boolean;
  trackEvent?: AnalyticsEvent;
  trackProps?: Record<string, string>;
  className?: string;
  children: ReactNode;
}

type LinkButtonProps = CommonProps & { href: string; external?: boolean; ariaLabel?: string; onClick?: () => void };

/** Primary CTA link — locale-aware unless `external`. */
export function ButtonLink({ href, external, ariaLabel, onClick: onClickProp, variant = 'primary', size = 'md', magnetic, trackEvent, trackProps, className, children }: LinkButtonProps) {
  const cls = buttonClasses(variant, size, className);
  const onClick = () => {
    if (trackEvent) track(trackEvent, trackProps);
    onClickProp?.();
  };
  const el = external ? (
    <a href={href} className={cls} onClick={onClick} aria-label={ariaLabel} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
  return (magnetic ?? variant === 'primary') ? <Magnetic>{el}</Magnetic> : el;
}

type NativeButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>;

export const Button = forwardRef<HTMLButtonElement, NativeButtonProps>(function Button(
  { variant = 'primary', size = 'md', magnetic, trackEvent, trackProps, className, children, onClick, type = 'button', ...rest },
  ref,
) {
  const el = (
    <button
      ref={ref}
      type={type}
      className={buttonClasses(variant, size, className)}
      onClick={(e) => {
        if (trackEvent) track(trackEvent, trackProps);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
  return (magnetic ?? false) ? <Magnetic>{el}</Magnetic> : el;
});
