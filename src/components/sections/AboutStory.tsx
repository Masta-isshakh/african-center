import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { brand, filled } from '@/lib/brand';
import type { Locale } from '@/i18n/routing';
import { Section, Eyebrow } from '@/components/ui/Section';
import { Media } from '@/components/ui/Media';
import { DirIcon } from '@/components/ui/DirIcon';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { DrawLine } from '@/components/motion/DrawLine';

/** Registration badge overlaid on the office photo. */
export function RegistrationSeal({ locale, className }: { locale: Locale; className?: string }) {
  const t = useTranslations('common');
  return (
    <div className={className}>
      <div className="glass flex items-center gap-4 rounded-lg p-4 text-white">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-400/60 text-gold-300">
          <DirIcon icon={ShieldCheck} className="h-6 w-6" />
        </span>
        <p className="text-sm leading-snug">
          {t('registrationLine', {
            reg: brand.registration.number,
            disciplines: brand.registration.disciplines[locale],
            grade: brand.registration.grade[locale],
          })}
        </p>
      </div>
    </div>
  );
}

export function AboutStory() {
  const t = useTranslations('about');
  const locale = useLocale() as Locale;
  const vars = { reg: brand.registration.number, disciplines: brand.registration.disciplines[locale], grade: brand.registration.grade[locale] };
  const africa = filled(t('africaStory'));
  const milestones = [
    { key: 'm1', title: t('milestones.m1.title'), body: t('milestones.m1.body', vars) },
    { key: 'm2', title: t('milestones.m2.title', { year: brand.foundingYear }), body: t('milestones.m2.body') },
    { key: 'm3', title: t('milestones.m3.title'), body: t('milestones.m3.body') },
  ];

  return (
    <Section id="about" tone="white" labelledBy="about-title">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal direction="inline-start" className="relative lg:col-span-5">
            <Media slot="aboutOffice" alt={t('imageAlt')} className="rounded-xl" sizes="(min-width:1024px) 40vw, 100vw" />
            <RegistrationSeal locale={locale} className="absolute -bottom-6 end-4 start-4 sm:end-auto sm:max-w-sm" />
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{t('eyebrow')}</Eyebrow>
              <h2 id="about-title" className="mt-4 text-display-xl font-bold text-navy-800">
                {t('title')}
              </h2>
              <span aria-hidden="true" className="gold-rule mt-6" />
              <p className="mt-6 text-lg text-ink/80">{t('body1', vars)}</p>
              <p className="mt-4 text-ink/75">{t('body2')}</p>
              {africa && <p className="mt-4 border-s-2 border-gold-500 ps-4 text-ink/75">{africa}</p>}
              <ButtonLink href="/about" variant="outline" className="mt-8">
                {t('cta')}
                <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
              </ButtonLink>
            </Reveal>
          </div>
        </div>

        <div className="relative mt-24">
          <DrawLine className="absolute inset-x-[16%] top-7 hidden md:block" />
          <Reveal stagger as="ol" className="relative grid gap-8 md:grid-cols-3">
            {milestones.map((m, i) => (
              <RevealItem as="li" key={m.key} className="text-center">
                <span className="text-outline-gold mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold-500/50 bg-white font-display text-xl font-bold">
                  <span className="num">{`0${i + 1}`}</span>
                </span>
                <h3 className="mx-auto mt-5 max-w-xs text-base text-navy-800">{m.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-ink/65">{m.body}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
