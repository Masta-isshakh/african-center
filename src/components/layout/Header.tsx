'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { navItems, type NavKey } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { Wordmark } from '@/components/ui/Wordmark';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

/** Which nav item is current: route match everywhere, plus scroll-spy for #how on the home page. */
function useActiveKey(): NavKey | null {
  const pathname = usePathname();
  const [section, setSection] = useState<'home' | 'how'>('home');

  useEffect(() => {
    if (pathname !== '/') return;
    const el = document.getElementById('how');
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setSection(entry.isIntersecting ? 'how' : 'home'), {
      rootMargin: '-45% 0px -45% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  if (pathname === '/') return section;
  const match = navItems.find((item) => !item.section && pathname.startsWith(item.href));
  return match?.key ?? null;
}

export function Header() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveKey();
  const navRef = useRef<HTMLUListElement>(null);
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null);

  // Gold underline that slides between items: measured from the active link, animated with a CSS transition.
  useEffect(() => {
    const measure = () => {
      const el = navRef.current?.querySelector<HTMLElement>('[data-active="true"] [data-label]');
      const link = el?.offsetParent as HTMLElement | null | undefined;
      // offsetParent is null while the desktop nav is display:none (below xl)
      setBar(el && link ? { x: el.offsetLeft + link.offsetLeft, w: el.offsetWidth } : null);
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500',
        scrolled ? 'glass border-x-0 border-t-0' : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container-site flex h-[var(--header-h)] items-center gap-4">
        <Link href="/" className="min-w-0 shrink rounded-md" aria-label={t('common.home')}>
          <Wordmark locale={locale} tone="light" label={t('common.media.logo')} />
        </Link>

        <nav aria-label={t('nav.label')} className="ms-auto hidden xl:block">
          <ul ref={navRef} className="relative flex items-center">
            {navItems.map((item) => {
              const isActive = active === item.key;
              return (
                <li key={item.key} data-active={isActive}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? (item.section ? 'location' : 'page') : undefined}
                    className={cn(
                      'relative block whitespace-nowrap px-2.5 py-2 text-[0.875rem] font-medium transition-colors 2xl:px-3.5',
                      isActive ? 'text-white' : 'text-white/70 hover:text-white',
                    )}
                  >
                    <span data-label>{t(`nav.${item.key}`)}</span>
                  </Link>
                </li>
              );
            })}
            {/* physical `left` + translateX because offsetLeft is physical in both directions */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-0.5 h-0.5 rounded-full bg-gold-500 transition-[transform,width,opacity] duration-500 ease-out-expo"
              style={{ left: 0, width: bar?.w ?? 0, transform: `translateX(${bar?.x ?? 0}px)`, opacity: bar ? 1 : 0 }}
            />
          </ul>
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-2 xl:ms-4">
          <LanguageSwitcher />
          <ButtonLink href="/sign-in" variant="ghostDark" size="sm" className="hidden 2xl:inline-flex">
            {t('common.signIn')}
          </ButtonLink>
          <ButtonLink href="/start" size="sm" className="hidden sm:inline-flex" trackEvent="cta_start_project" trackProps={{ placement: 'header' }}>
            {t('common.ctaStartShort')}
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t('common.openMenu')}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-gold-400/60 xl:hidden"
          >
            <DirIcon icon={Menu} className="h-5 w-5" flip />
          </button>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} active={active} />
    </header>
  );
}
