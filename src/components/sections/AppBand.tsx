import { useTranslations } from 'next-intl';
import { BellRing } from 'lucide-react';
import { Media } from '@/components/ui/Media';
import { media } from '@/lib/media';
import { AppBadges } from '@/components/ui/AppBadges';
import { Eyebrow } from '@/components/ui/Section';
import { DirIcon } from '@/components/ui/DirIcon';
import { ScrollTilt } from '@/components/motion/Tilt';
import { Reveal } from '@/components/motion/Reveal';

export function AppBand() {
  const t = useTranslations('app');
  return (
    <section aria-labelledby="app-title" className="relative overflow-hidden bg-gradient-to-br from-navy-700 via-navy-900 to-charcoal py-20 text-white sm:py-24 rtl:bg-gradient-to-bl">
      <div aria-hidden="true" className="absolute -end-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-gold-500/10 blur-3xl" />
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow dark>{t('eyebrow')}</Eyebrow>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/50 bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-200">
              <DirIcon icon={BellRing} className="h-3.5 w-3.5" />
              {t('comingSoon')}
            </span>
          </div>
          <h2 id="app-title" className="mt-5 text-display-xl font-bold">
            {t('title')}
          </h2>
          <span aria-hidden="true" className="gold-rule mt-6" />
          <p className="mt-6 max-w-lg text-lg text-white/75">{t('body')}</p>
          <AppBadges className="mt-8" />
        </Reveal>
        <div className="mx-auto w-48 sm:w-56 lg:w-64">
          <ScrollTilt>
            {media.appPhone ? (
              <Media slot="appPhone" alt={t('phoneAlt')} className="rounded-[2rem] bg-transparent shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]" sizes="(min-width:1024px) 256px, 224px" />
            ) : (
              <div className="rounded-[2.5rem] border border-white/15 bg-navy-950 p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]">
                <Media slot="appPhone" alt={t('phoneAlt')} className="rounded-[2rem]" sizes="256px" />
              </div>
            )}
          </ScrollTilt>
        </div>
      </div>
    </section>
  );
}
