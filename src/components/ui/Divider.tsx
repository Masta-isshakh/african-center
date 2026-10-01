import { cn } from '@/lib/utils';

const fills = {
  sand: '#F7F4EE',
  white: '#FFFFFF',
  charcoal: '#101418',
  navy: '#02101F',
} as const;

type Tone = keyof typeof fills;

/**
 * Transition between a light and a dark section. Sits at the top of the *next* section,
 * painting the previous section's colour as a diagonal or curved edge. Mirrors in RTL.
 */
export function Divider({ from, to, shape = 'diagonal', className }: { from: Tone; to: Tone; shape?: 'diagonal' | 'curve'; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none relative -mb-px h-12 w-full sm:h-16 lg:h-20', className)} style={{ background: fills[to] }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full rtl:-scale-x-100">
        {shape === 'diagonal' ? (
          <path d="M0 0H1440V8L0 80Z" fill={fills[from]} />
        ) : (
          <path d="M0 0H1440V20C1080 80 360 80 0 20Z" fill={fills[from]} />
        )}
        <path
          d={shape === 'diagonal' ? 'M0 80L1440 8' : 'M0 20C360 80 1080 80 1440 20'}
          fill="none"
          stroke="#C99A2E"
          strokeOpacity=".35"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
