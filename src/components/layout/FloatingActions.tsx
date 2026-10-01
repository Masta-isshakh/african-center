'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUp, MessageCircle, Phone } from 'lucide-react';
import { whatsappHref, telHref } from '@/lib/contact';
import { track } from '@/lib/analytics';
import { DirIcon } from '@/components/ui/DirIcon';
import { cn } from '@/lib/utils';

/**
 * Desktop: WhatsApp button stacked above back-to-top (inline-end).
 * Mobile: only back-to-top, lifted above the sticky CTA bar.
 * Until `brand.whatsapp` is set, the WhatsApp button falls back to a call button.
 */
export function FloatingActions() {
  const t = useTranslations();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const wa = whatsappHref(t('whatsapp.prefill'));

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const C = 2 * Math.PI * 22;

  return (
    <div className="pointer-events-none fixed bottom-24 end-4 z-40 flex flex-col items-center gap-3 md:bottom-6 md:end-6">
      <a
        href={wa ?? telHref()}
        target={wa ? '_blank' : undefined}
        rel={wa ? 'noopener noreferrer' : undefined}
        onClick={() => wa && track('whatsapp_click', { placement: 'floating' })}
        aria-label={wa ? t('whatsapp.chat') : t('common.callUs')}
        className="pointer-events-auto hidden h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lift transition-transform duration-300 hover:-translate-y-1 md:grid"
      >
        <DirIcon icon={wa ? MessageCircle : Phone} className="h-6 w-6" />
      </a>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t('common.backToTop')}
        tabIndex={visible ? 0 : -1}
        className={cn(
          'pointer-events-auto relative grid h-12 w-12 place-items-center rounded-full bg-navy-950/90 text-white shadow-lift backdrop-blur transition-all duration-500',
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
          <circle cx="24" cy="24" r="22" fill="none" stroke="#C99A2E" strokeWidth="2" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
        </svg>
        <DirIcon icon={ArrowUp} className="relative h-5 w-5" />
      </button>
    </div>
  );
}
