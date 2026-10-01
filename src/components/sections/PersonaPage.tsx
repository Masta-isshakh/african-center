import { getTranslations } from 'next-intl/server';
import { ArrowRight, Check, FileCheck2, Gift, Gauge, Handshake, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { personaCta, personaPath, type Persona } from '@/lib/site';
import { localizedUrl, serviceJsonLd, type MetaPage } from '@/lib/seo';
import { pad2 } from '@/lib/utils';
import { commissionPhrase } from '@/lib/commission';
import { PageHero } from '@/components/ui/PageHero';
import { Section, SectionHeading, Eyebrow } from '@/components/ui/Section';
import { Media } from '@/components/ui/Media';
import { ButtonLink } from '@/components/ui/Button';
import { VideoButton } from '@/components/ui/VideoButton';
import { DirIcon } from '@/components/ui/DirIcon';
import { JsonLd } from '@/components/ui/JsonLd';
import { CtaBand } from '@/components/ui/CtaBand';
import { Accordion } from '@/components/ui/Accordion';
import { TrustRow } from '@/components/ui/TrustRow';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { personaCardSlot } from './Personas';
import { InterestFormLazy } from '@/components/ui/LazyForms';

export const personaMetaPage: Record<Persona, MetaPage> = {
  owner: 'owners',
  contractor: 'contractors',
  supplier: 'suppliers',
  consultant: 'consultants',
};

const benefitIcons: LucideIcon[] = [Gift, Gauge, FileCheck2, Sparkles, ShieldCheck, Handshake];
const benefitKeys = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] as const;
const stepKeys = ['s1', 's2', 's3', 's4', 's5'] as const;
const reqKeys = ['r1', 'r2', 'r3', 'r4'] as const;
const faqKeys = ['f1', 'f2', 'f3'] as const;

/** One template for /owners, /contractors, /suppliers and /consultants. */
export async function PersonaPage({ persona, locale }: { persona: Persona; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: `personaPages.${persona}` });
  const tp = await getTranslations({ locale, namespace: 'personaPage' });
  const tf = await getTranslations({ locale, namespace: 'faqPage' });
  const tm = await getTranslations({ locale, namespace: 'meta' });
  const tc = await getTranslations({ locale, namespace: 'common' });

  const commission = commissionPhrase(tf);
  const cta = personaCta[persona];
  const isOwner = persona === 'owner';
  const ctaEvent = isOwner ? 'cta_start_project' : 'cta_register_persona';
  const page = personaMetaPage[persona];

  const faq = faqKeys.map((k) => ({ id: k, q: t(`faq.${k}.q`), a: t(`faq.${k}.a`, { commission }) }));

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ name: tc(`personasPlural.${persona}`), path: personaPath[persona] }]}
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
        aside={
          <div className="relative">
            <Media slot={personaCardSlot[persona]} alt={t('imageAlt')} priority className="rounded-xl border border-white/10" sizes="(min-width:1024px) 40vw, 100vw" />
            <div aria-hidden="true" className="absolute -bottom-3 -end-3 -z-10 h-full w-full rounded-xl border border-gold-500/30" />
          </div>
        }
      >
        <div className="flex flex-wrap gap-4">
          <ButtonLink href={cta} size="lg" trackEvent={ctaEvent} trackProps={{ persona, placement: 'persona_hero' }}>
            {t('cta')}
            <DirIcon icon={ArrowRight} flip className="h-5 w-5" />
          </ButtonLink>
          {(persona === 'owner' || persona === 'contractor') && (
            <VideoButton slot={persona === 'owner' ? 'ownerVideo' : 'contractorVideo'} label={tp('watchVideo')} title={t('processTitle')} fallbackHref="#process" />
          )}
        </div>
        <TrustRow dark className="mt-6" />
      </PageHero>

      <Section tone="sand" labelledBy="benefits-title">
        <div className="container-site">
          <SectionHeading id="benefits-title" eyebrow={tp('benefitsEyebrow')} title={t('benefitsTitle')} />
          <Reveal stagger amount={0.1} as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefitKeys.map((k, i) => (
              <RevealItem as="li" key={k} className="card-lift rounded-xl border border-mist bg-white p-7">
                <DirIcon icon={benefitIcons[i]} className="h-7 w-7 text-gold-700" strokeWidth={1.5} />
                <h3 className="mt-5 text-lg text-navy-800">{t(`benefits.${k}.title`)}</h3>
                <p className="mt-2 text-ink/70">{t(`benefits.${k}.body`)}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section id="process" tone="dark" labelledBy="persona-process-title">
        <div className="container-site">
          <SectionHeading id="persona-process-title" dark eyebrow={tp('processEyebrow')} title={t('processTitle')} />
          <Reveal stagger as="ol" className="relative mt-14 grid gap-8 md:grid-cols-5 md:gap-5">
            <div aria-hidden="true" className="absolute inset-x-[10%] top-6 hidden h-px bg-gradient-to-r from-gold-500/10 via-gold-500/60 to-gold-500/10 md:block" />
            {stepKeys.map((k, i) => (
              <RevealItem as="li" direction="inline-start" key={k} className="relative flex gap-4 md:block md:text-center">
                <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-500/60 bg-charcoal font-display text-lg font-bold text-gold-300 md:mx-auto">
                  <span className="num">{pad2(i + 1)}</span>
                </span>
                <div>
                  <h3 className="text-base text-white md:mt-5">{t(`process.${k}.title`)}</h3>
                  <p className="mt-2 text-sm text-white/65">{t(`process.${k}.body`)}</p>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section tone="white">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>{tp('requirementsEyebrow')}</Eyebrow>
            <h2 className="mt-4 text-display-lg font-bold text-navy-800">{t('requirementsTitle')}</h2>
            <span aria-hidden="true" className="gold-rule mt-6" />
            <Reveal stagger as="ul" className="mt-8 space-y-3">
              {reqKeys.map((k) => (
                <RevealItem as="li" direction="inline-start" key={k} className="flex items-start gap-3 rounded-lg border border-mist bg-sand/60 p-4">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-950">
                    <DirIcon icon={Check} className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-ink/85">{t(`requirements.${k}`)}</span>
                </RevealItem>
              ))}
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>{tp('faqEyebrow')}</Eyebrow>
            <h2 className="mt-4 text-display-lg font-bold text-navy-800">{t('faqTitle')}</h2>
            <span aria-hidden="true" className="gold-rule mb-8 mt-6" />
            <Accordion items={faq} />
            <ButtonLink href="/faq" variant="ghost" className="mt-4 px-0 hover:bg-transparent hover:text-gold-700">
              {tp('allFaq')}
              <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <CtaBand title={t('ctaTitle')} body={t('ctaBody')} cta={t('cta')} href={cta} trackEvent={ctaEvent} trackProps={{ persona, placement: 'persona_footer' }}>
        <InterestFormLazy persona={persona} />
      </CtaBand>

      <JsonLd
        data={serviceJsonLd({
          name: t('serviceName'),
          description: tm(`${page}.description`),
          url: localizedUrl(locale, personaPath[persona]),
          audience: tc(`personas.${persona}`),
        })}
      />
    </>
  );
}
