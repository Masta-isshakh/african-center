import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { brand, filled } from '@/lib/brand';
import { media, mediaSpecs } from '@/lib/media';
import { cn } from '@/lib/utils';

type Store = 'appStore' | 'googlePlay';

const glyph: Record<Store, string> = {
  appStore:
    'M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.5-3.9ZM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4Z',
  googlePlay:
    'M3.6 2.3 13.4 12l-9.8 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1Zm10.8 8.7 2.6-2.6-11.4-6.6 8.8 9.2Zm0 2-8.8 9.2 11.4-6.6-2.6-2.6Zm3.7-3.9 2.9 1.7c.7.4.7 1.4 0 1.8l-2.9 1.7-2.8-2.7 2.8-2.5Z',
};

/**
 * Store badges. Uses the official badge files from the media manifest when present,
 * otherwise a typeset badge. Never linked until the store URL in `brand.apps` is filled.
 */
export function AppBadges({ className }: { className?: string }) {
  const t = useTranslations('app');
  const stores: { key: Store; slot: 'appStoreBadge' | 'googlePlayBadge'; pre: string; name: string; label: string }[] = [
    { key: 'appStore', slot: 'appStoreBadge', pre: t('downloadOn'), name: t('appStore'), label: t('appStoreLabel') },
    { key: 'googlePlay', slot: 'googlePlayBadge', pre: t('getItOn'), name: t('googlePlay'), label: t('googlePlayLabel') },
  ];

  return (
    <ul className={cn('flex flex-wrap items-center gap-3', className)}>
      {stores.map((s) => {
        const url = filled(brand.apps[s.key]);
        const file = media[s.slot];
        const badge = file ? (
          <span className="relative block h-11" style={{ aspectRatio: mediaSpecs[s.slot].aspect }}>
            <Image src={file} alt={s.label} fill sizes="160px" className="object-contain" />
          </span>
        ) : (
          <span className="flex h-11 items-center gap-2.5 rounded-lg border border-white/25 bg-charcoal px-3.5 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d={glyph[s.key]} />
            </svg>
            <span className="leading-none">
              <span className="block text-[10px] text-white/80">{s.pre}</span>
              <span className="mt-0.5 block font-wordmark-sans text-sm font-semibold" dir="ltr">
                {s.name}
              </span>
            </span>
          </span>
        );
        return (
          <li key={s.key}>
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="block transition-transform hover:-translate-y-0.5">
                {badge}
              </a>
            ) : (
              <span aria-label={`${s.label} — ${t('comingSoon')}`} role="img">
                {badge}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
