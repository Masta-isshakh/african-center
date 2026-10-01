import { useTranslations } from 'next-intl';
import { BadgeCheck, ShieldCheck, Eye } from 'lucide-react';
import { brand } from '@/lib/brand';
import { DirIcon } from './DirIcon';
import { cn } from '@/lib/utils';

/** Three inline guarantees that sit under every primary CTA. */
export function TrustRow({ dark, className, align = 'start' }: { dark?: boolean; className?: string; align?: 'start' | 'center' }) {
  const t = useTranslations('common.trust');
  const items = [
    { icon: BadgeCheck, text: t('free') },
    { icon: ShieldCheck, text: t('licensed', { reg: brand.registration.number }) },
    { icon: Eye, text: t('transparent') },
  ];
  return (
    <ul
      aria-label={t('label')}
      className={cn('flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium', align === 'center' && 'justify-center', dark ? 'text-white/75' : 'text-ink/70', className)}
    >
      {items.map(({ icon, text }) => (
        <li key={text} className="inline-flex items-center gap-1.5">
          <DirIcon icon={icon} className={cn('h-4 w-4 shrink-0', dark ? 'text-gold-400' : 'text-gold-700')} />
          {text}
        </li>
      ))}
    </ul>
  );
}
