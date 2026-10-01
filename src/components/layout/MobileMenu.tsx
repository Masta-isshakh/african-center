'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { X, Phone, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { navItems, type NavKey } from '@/lib/site';
import { brand } from '@/lib/brand';
import { formatPhone } from '@/lib/format';
import { telHref, whatsappHref } from '@/lib/contact';
import { track } from '@/lib/analytics';
import type { Locale } from '@/i18n/routing';
import { Wordmark } from '@/components/ui/Wordmark';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  active: NavKey | null;
}

/** Full-screen navigation overlay for < 1280px, with a focus trap and staggered link reveal. */
export function MobileMenu({ open, onClose, active }: Props) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wa = whatsappHref(t('whatsapp.prefill'));
  // mounted → in the DOM; shown → transitioned in. Lets the overlay fade out before unmounting.
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const id = window.setTimeout(() => setMounted(false), 300);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open || !mounted) return;
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open, mounted, onClose]);

  return (
    mounted && (
        <div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.label')}
          data-lenis-prevent
          className={cn(
            'surface-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto !bg-navy-950 transition-opacity duration-300 xl:hidden',
            shown ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div className="container-site flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Link href="/" onClick={onClose} aria-label={t('common.home')}>
              <Wordmark locale={locale} tone="light" label={t('common.media.logo')} />
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t('common.closeMenu')}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white hover:border-gold-400/60"
            >
              <DirIcon icon={X} className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label={t('nav.label')} className="container-site flex-1 py-6">
            <ul className="divide-y divide-white/10">
              {navItems.map((item, i) => (
                <li
                  key={item.key}
                  style={{ transitionDelay: shown ? `${100 + i * 50}ms` : '0ms' }}
                  className={cn(
                    'transition-[opacity,transform] duration-500 ease-out-expo',
                    shown ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0 rtl:translate-x-6',
                  )}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active === item.key ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between py-4 font-display text-2xl font-bold transition-colors',
                      active === item.key ? 'text-gold-400' : 'text-white hover:text-gold-300',
                    )}
                  >
                    {t(`nav.${item.key}`)}
                    <DirIcon icon={ArrowUpRight} flip className="h-5 w-5 text-white/40" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/start" onClick={onClose} size="lg" trackEvent="cta_start_project" trackProps={{ placement: 'mobile_menu' }}>
                {t('common.ctaStart')}
              </ButtonLink>
              <ButtonLink href="/sign-in" onClick={onClose} variant="secondary" size="lg">
                {t('common.signIn')}
              </ButtonLink>
            </div>
          </nav>

          <div className="container-site shrink-0 border-t border-white/10 py-6">
            <p className="text-sm text-white/60">{t('nav.mobileContact')}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {brand.phones.map((p) => (
                <a key={p} href={telHref(p)} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:border-gold-400/60">
                  <DirIcon icon={Phone} className="h-4 w-4 text-gold-400" />
                  <span className="num">{formatPhone(p)}</span>
                </a>
              ))}
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_click', { placement: 'mobile_menu' })}
                  className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white"
                >
                  <DirIcon icon={MessageCircle} className="h-4 w-4" />
                  {t('whatsapp.label')}
                </a>
              )}
              <LanguageSwitcher className="ms-auto" />
            </div>
          </div>
        </div>
      )
  );
}
