'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { localeCodes, locales, type Locale } from '@/i18n/routing';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/** AR ⇄ EN pill. Keeps the current path, query and hash. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');
  const other: Locale = locale === 'ar' ? 'en' : 'ar';

  const switchLocale = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    track('language_switched', { from: locale, to: other });
    const { search, hash } = window.location;
    router.replace(`${pathname}${search}${hash}`, { locale: other });
  };

  return (
    <a
      href={`/${other}${pathname === '/' ? '' : pathname}`}
      hrefLang={other}
      lang={other}
      onClick={switchLocale}
      aria-label={t('languageLabel')}
      className={cn(
        'group relative inline-flex h-9 items-center rounded-full border border-white/20 bg-white/5 p-1 text-xs font-bold tracking-wider text-white/80 transition-colors hover:border-gold-400/60',
        className,
      )}
    >
      {locales.map((l) => (
        <span
          key={l}
          dir="ltr"
          aria-hidden="true"
          className={cn(
            'grid h-7 min-w-[2.25rem] place-items-center rounded-full px-2 font-wordmark-sans transition-colors duration-300',
            l === locale ? 'bg-gold-500 text-navy-950' : 'group-hover:text-white',
          )}
        >
          {localeCodes[l]}
        </span>
      ))}
    </a>
  );
}
