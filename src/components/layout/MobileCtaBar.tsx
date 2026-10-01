'use client';

import { useTranslations } from 'next-intl';
import { MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { whatsappHref, telHref } from '@/lib/contact';
import { track } from '@/lib/analytics';
import { DirIcon } from '@/components/ui/DirIcon';

/** Sticky bottom bar under 768px. Hidden while the brief wizard is open. */
export function MobileCtaBar() {
  const t = useTranslations();
  const pathname = usePathname();
  if (pathname.startsWith('/start')) return null;
  const wa = whatsappHref(t('whatsapp.prefill'));

  return (
    <div className="glass fixed inset-x-0 bottom-0 z-40 border-x-0 border-b-0 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 md:hidden">
      <div className="flex gap-3">
        <a
          href={wa ?? telHref()}
          target={wa ? '_blank' : undefined}
          rel={wa ? 'noopener noreferrer' : undefined}
          onClick={() => wa && track('whatsapp_click', { placement: 'mobile_bar' })}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp text-sm font-semibold text-white"
        >
          <DirIcon icon={wa ? MessageCircle : Phone} className="h-5 w-5" />
          {wa ? t('whatsapp.label') : t('common.call')}
        </a>
        <Link
          href="/start"
          onClick={() => track('cta_start_project', { placement: 'mobile_bar' })}
          className="btn-sheen inline-flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-full bg-gold-500 text-sm font-bold text-navy-950"
        >
          {t('common.ctaStartShort')}
          <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
