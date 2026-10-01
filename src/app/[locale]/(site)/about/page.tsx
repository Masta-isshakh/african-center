import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Eye, ShieldCheck, Ruler, Scale, PencilRuler, Building, ClipboardList, HardHat, type LucideIcon } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { brand, filled } from '@/lib/brand';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';
import { Section, SectionHeading, Eyebrow } from '@/components/ui/Section';
import { Media } from '@/components/ui/Media';
import { DirIcon } from '@/components/ui/DirIcon';
import { CtaBand } from '@/components/ui/CtaBand';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { RegistrationSeal } from '@/components/sections/AboutStory';
import { ContactDetails, OfficeMap } from '@/components/sections/ContactSection';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'about');
}

const team: { key: 'architecture' | 'civil' | 'tendering' | 'supervision'; icon: LucideIcon }[] = [
  { key: 'architecture', icon: PencilRuler },
  { key: 'civil', icon: Building },
  { key: 'tendering', icon: ClipboardList },
  { key: 'supervision', icon: HardHat },
];
const values: { key: 'transparency' | 'owner' | 'precision' | 'fairness'; icon: LucideIcon }[] = [
  { key: 'transparency', icon: Eye },
  { key: 'owner', icon: ShieldCheck },
  { key: 'precision', icon: Ruler },
  { key: 'fairness', icon: Scale },
];

export default async function AboutPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'aboutPage' });
  const ta = await getTranslations({ locale, namespace: 'about' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const tct = await getTranslations({ locale, namespace: 'contact' });
  const vars = { reg: brand.registration.number, disciplines: brand.registration.disciplines[locale], grade: brand.registration.grade[locale] };
  const africa = filled(ta('africaStory'));
  const registration = [
    { label: t('registration.number'), value: brand.registration.number, num: true },
    { label: t('registration.disciplines'), value: brand.registration.disciplines[locale] },
    { label: t('registration.grade'), value: brand.registration.grade[locale] },
    { label: t('registration.founded'), value: brand.foundingYear, num: true },
  ];

  return (
    <>
      <PageHero locale={locale} crumbs={[{ name: t('eyebrow'), path: '/about' }]} eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <Section tone="white" labelledBy="story-title">
        <div className="container-site grid items-center gap-12 lg:grid-cols-12">
          <Reveal direction="inline-start" className="relative lg:col-span-5">
            <Media slot="aboutOffice" alt={ta('imageAlt')} className="rounded-xl" sizes="(min-width:1024px) 40vw, 100vw" />
            <RegistrationSeal locale={locale} className="absolute -bottom-6 end-4 start-4 sm:end-auto sm:max-w-sm" />
          </Reveal>
          <Reveal className="lg:col-span-7">
            <Eyebrow>{ta('eyebrow')}</Eyebrow>
            <h2 id="story-title" className="mt-4 text-display-xl font-bold text-navy-800">
              {t('storyTitle')}
            </h2>
            <span aria-hidden="true" className="gold-rule mt-6" />
            <p className="mt-6 text-lg text-ink/80">{ta('body1', vars)}</p>
            <p className="mt-4 text-ink/75">{ta('body2')}</p>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" labelledBy="reg-title">
        <div className="container-site">
          <SectionHeading id="reg-title" dark eyebrow={tc('trust.label')} title={t('registrationTitle')} />
          <Reveal stagger as="div" className="mt-12">
            <dl className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {registration.map((r) => (
                <RevealItem key={r.label} className="bg-charcoal p-7">
                  <dt className="text-sm text-white/60">{r.label}</dt>
                  <dd className="mt-3 font-display text-display-lg font-bold text-gold-300">{r.num ? <span className="num">{r.value}</span> : r.value}</dd>
                </RevealItem>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      <Section tone="sand" labelledBy="team-title">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading id="team-title" eyebrow={ta('eyebrow')} title={t('teamTitle')} lead={t('teamLead')} />
            <Reveal stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-2">
              {team.map(({ key, icon }) => (
                <RevealItem as="li" key={key} className="card-lift rounded-xl border border-mist bg-white p-6">
                  <DirIcon icon={icon} className="h-7 w-7 text-gold-700" strokeWidth={1.5} />
                  <h3 className="mt-4 text-base text-navy-800">{t(`team.${key}.title`)}</h3>
                  <p className="mt-1.5 text-sm text-ink/65">{t(`team.${key}.body`)}</p>
                </RevealItem>
              ))}
            </Reveal>
          </div>
          <Reveal className="lg:col-span-6">
            <Media slot="aboutTeam" alt={t('teamAlt')} className="rounded-xl" sizes="(min-width:1024px) 50vw, 100vw" />
          </Reveal>
        </div>
      </Section>

      <Section tone="white" labelledBy="values-title">
        <div className="container-site">
          <SectionHeading id="values-title" align="center" eyebrow={tc('trust.label')} title={t('valuesTitle')} />
          <Reveal stagger as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ key, icon }) => (
              <RevealItem as="li" key={key} className="rounded-xl border border-mist bg-sand/60 p-7 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold-500/40 text-gold-700">
                  <DirIcon icon={icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg text-navy-800">{t(`values.${key}.title`)}</h3>
                <p className="mt-2 text-sm text-ink/70">{t(`values.${key}.body`)}</p>
              </RevealItem>
            ))}
          </Reveal>
          {africa && (
            <Reveal className="mx-auto mt-16 max-w-3xl border-s-2 border-gold-500 ps-6">
              <h2 className="text-display-lg font-bold text-navy-800">{t('africaTitle')}</h2>
              <p className="mt-4 text-lg text-ink/75">{africa}</p>
            </Reveal>
          )}
        </div>
      </Section>

      <Section tone="sand" labelledBy="office-title">
        <div className="container-site">
          <SectionHeading id="office-title" eyebrow={tct('eyebrow')} title={t('officeTitle')} />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <ContactDetails />
            <OfficeMap />
          </div>
        </div>
      </Section>

      <CtaBand title={ta('title')} cta={tc('ctaStart')} href="/start" trackProps={{ placement: 'about_page' }} />
    </>
  );
}
