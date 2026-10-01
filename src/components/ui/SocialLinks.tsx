import { useTranslations } from 'next-intl';
import { brand, filled, type SocialNetwork } from '@/lib/brand';
import { cn } from '@/lib/utils';

const paths: Record<SocialNetwork, string> = {
  instagram:
    'M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2ZM17.1 5.8a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 3c-2.4 0-2.7 0-3.7.1-3.3.1-5 1.8-5.2 5.2C3 9.3 3 9.6 3 12s0 2.7.1 3.7c.1 3.3 1.8 5 5.2 5.2 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c3.3-.1 5-1.8 5.2-5.2.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c-.1-3.3-1.8-5-5.2-5.2C14.7 3 14.4 3 12 3Zm0 1.6c2.4 0 2.6 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.4-.1-3.6-1.3-3.7-3.7-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6c.1-2.4 1.3-3.6 3.7-3.7.9-.1 1.2-.1 3.6-.1Z',
  linkedin:
    'M6.9 8.8H3.6V20h3.3V8.8ZM5.2 3.5a1.9 1.9 0 1 0 0 3.9 1.9 1.9 0 0 0 0-3.9ZM20.4 13.6c0-3.1-.7-5.1-4.1-5.1-1.7 0-2.8.6-3.3 1.5V8.8H9.9V20h3.3v-5.5c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.6 1.8 3V20h3.3v-6.4Z',
  x: 'M17.6 3.5h2.9l-6.4 7.3 7.5 9.7h-5.9l-4.6-6-5.3 6H2.9l6.8-7.8-7.2-9.2h6l4.2 5.5 4.9-5.5Zm-1 15.3h1.6L7.5 5.1H5.8l10.8 13.7Z',
  youtube:
    'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z',
  facebook:
    'M13.5 21v-7.7h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.5-1.5h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z',
};

/** Social icons. Networks still marked `[SOCIAL_…]` render as muted, non-link "coming soon" chips. */
export function SocialLinks({ className }: { className?: string }) {
  const t = useTranslations();
  const networks = Object.keys(brand.social) as SocialNetwork[];
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {networks.map((n) => {
        const url = filled(brand.social[n]);
        const name = t(`common.social.${n}`);
        const icon = (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
            <path d={paths[n]} />
          </svg>
        );
        return (
          <li key={n}>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={name}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/70 hover:text-gold-300"
              >
                {icon}
              </a>
            ) : (
              <span
                title={t('footer.socialSoon', { network: name })}
                aria-label={t('footer.socialSoon', { network: name })}
                role="img"
                className="grid h-10 w-10 place-items-center rounded-full border border-dashed border-white/15 text-white/35"
              >
                {icon}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
