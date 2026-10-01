import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui/Button';
import { VideoButton } from '@/components/ui/VideoButton';
import { DirIcon } from '@/components/ui/DirIcon';
import { TrustRow } from '@/components/ui/TrustRow';
import { HeroMedia } from './HeroMedia';

/** Splits on whitespace so Arabic words stay intact; each word rises in 60ms after the previous one. */
function SplitWords({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="word-in" style={{ ['--i' as string]: i }}>
            {word}
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const t = useTranslations();
  return (
    <section id="top" aria-labelledby="hero-title" className="surface-dark relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-[calc(var(--header-h)+3rem)] sm:pb-24">
      <HeroMedia alt={t('hero.posterAlt')} />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal via-navy-950/45 to-navy-950/10" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/35 to-transparent rtl:bg-gradient-to-l" />

      <div className="absolute end-4 top-[calc(var(--header-h)+1rem)] z-10 flex gap-2 sm:end-6 2xl:hidden">
        <Link href="/sign-in" className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/85 backdrop-blur hover:border-gold-400/60">
          {t('common.signIn')}
        </Link>
        <Link href="/sign-up" className="rounded-full border border-gold-500/50 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-200 backdrop-blur hover:bg-gold-500/20">
          {t('common.signUp')}
        </Link>
      </div>

      <div className="container-site relative z-10">
        <div className="max-w-4xl">
          <p className="eyebrow eyebrow-dark rise-in" style={{ ['--d' as string]: '0ms' }}>
            {t('hero.eyebrow')}
          </p>
          <h1 id="hero-title" className="mt-6 text-display-2xl font-extrabold text-white">
            <SplitWords text={t('hero.title')} />
          </h1>
          <span aria-hidden="true" className="gold-rule rise-in mt-8 w-24" style={{ ['--d' as string]: '360ms' }} />
          <p className="rise-in mt-8 max-w-2xl text-lg text-white/80 sm:text-xl" style={{ ['--d' as string]: '300ms' }}>
            {t('hero.subtitle')}
          </p>
          <div className="rise-in mt-10 flex flex-wrap items-center gap-4" style={{ ['--d' as string]: '420ms' }}>
            <ButtonLink href="/start" size="lg" trackEvent="cta_start_project" trackProps={{ placement: 'hero' }}>
              {t('common.ctaStart')}
              <DirIcon icon={ArrowRight} flip className="h-5 w-5" />
            </ButtonLink>
            <VideoButton slot="ownerVideo" label={t('hero.ctaWatch')} title={t('hero.videoTitle')} fallbackHref="#how" />
          </div>
          <div className="rise-in mt-8" style={{ ['--d' as string]: '520ms' }}>
            <TrustRow dark />
          </div>
        </div>
      </div>

      <a href="#trust" className="absolute bottom-6 start-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[11px] font-medium text-white/55 hover:text-white sm:flex rtl:translate-x-1/2">
        <span>{t('hero.scroll')}</span>
        <span aria-hidden="true" className="block h-14 w-px overflow-hidden bg-white/10">
          <span className="block h-full w-full animate-scroll-line bg-gold-500" />
        </span>
      </a>
    </section>
  );
}
