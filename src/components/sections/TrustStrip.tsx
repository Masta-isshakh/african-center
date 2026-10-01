import { useLocale, useTranslations } from 'next-intl';
import { BadgeCheck, ShieldCheck, Eye, HardHat, type LucideIcon } from 'lucide-react';
import { brand, hasStats } from '@/lib/brand';
import { media, partnerSlots } from '@/lib/media';
import { showSampleContent } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';
import { DirIcon } from '@/components/ui/DirIcon';
import { Media } from '@/components/ui/Media';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { StatsCounters } from './StatsCounters';

const promises: { key: 'free' | 'licensed' | 'transparent' | 'supervision'; icon: LucideIcon }[] = [
  { key: 'free', icon: BadgeCheck },
  { key: 'licensed', icon: ShieldCheck },
  { key: 'transparent', icon: Eye },
  { key: 'supervision', icon: HardHat },
];

/**
 * Counters once every figure in `brand.stats` is confirmed; until then, launch mode:
 * four promise cards instead of invented numbers.
 */
export function TrustStrip() {
  const t = useTranslations('trust');
  const locale = useLocale() as Locale;
  const vars = { reg: brand.registration.number, disciplines: brand.registration.disciplines[locale], grade: brand.registration.grade[locale] };

  return (
    <section id="trust" aria-labelledby="trust-title" className="relative bg-sand pb-16 pt-0 sm:pb-20">
      <h2 id="trust-title" className="sr-only">
        {t('title')}
      </h2>
      <div className="container-site relative z-10 -mt-12 sm:-mt-16">
        {hasStats() ? (
          <StatsCounters />
        ) : (
          <Reveal stagger as="ul" amount={0.15} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map(({ key, icon }) => (
              <RevealItem as="li" key={key} className="card-lift group rounded-lg border border-mist bg-white p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-500/40 bg-gold-50 text-gold-700 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                  <DirIcon icon={icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base text-navy-800">{t(`launch.${key}.title`, vars)}</h3>
                <p className="mt-2 text-sm text-ink/70">{t(`launch.${key}.body`, vars)}</p>
              </RevealItem>
            ))}
          </Reveal>
        )}
      </div>
      <Partners />
    </section>
  );
}

/** Partner marquee — only real logos, or placeholders in sample-preview mode. */
function Partners() {
  const t = useTranslations('partners');
  const locale = useLocale();
  const slots = partnerSlots.filter((s) => media[s] || showSampleContent);
  if (!slots.length) return null;
  const loop = [...slots, ...slots];

  return (
    <div className="container-site mt-16">
      <p className="text-center text-sm font-semibold text-ink/70">{t('title')}</p>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <ul className={`flex w-max gap-6 hover:[animation-play-state:paused] ${locale === 'ar' ? 'animate-marquee-rtl' : 'animate-marquee'}`}>
          {loop.map((slot, i) => (
            <li key={`${slot}-${i}`} aria-hidden={i >= slots.length ? true : undefined} className="w-40 shrink-0 overflow-hidden rounded-md opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0">
              <Media slot={slot} alt={t('logoAlt', { n: String(i % slots.length + 1) })} sizes="160px" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
