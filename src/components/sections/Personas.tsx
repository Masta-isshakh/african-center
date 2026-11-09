import { useLocale, useTranslations } from 'next-intl';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { personas, personaPath } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { personaShowcase, showcaseAlt } from '@/content/showcase';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ProjectImage } from '@/components/portfolio/ProjectImage';
import { DirIcon } from '@/components/ui/DirIcon';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { Tilt } from '@/components/motion/Tilt';
import { cn } from '@/lib/utils';

export function Personas() {
  const t = useTranslations('personasSection');
  const locale = useLocale() as Locale;
  return (
    <Section id="for-whom" tone="sand" labelledBy="personas-title" className="pt-8 sm:pt-10 lg:pt-16">
      <div className="container-site">
        <SectionHeading id="personas-title" eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <Reveal stagger amount={0.1} as="ul" className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {personas.map((p) => {
            const showcase = personaShowcase[p];
            return (
              <RevealItem as="li" key={p} className="h-full">
                <Tilt className="h-full">
                  <article
                    className={cn(
                      'card-lift group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white',
                      p === 'owner' ? 'border-gold-500/50' : 'border-mist',
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-navy-900">
                      <ProjectImage
                        image={showcase.image}
                        maxWidth={1440}
                        alt={showcaseAlt(showcase, locale)}
                        fill
                        sizes="(min-width:1280px) 25vw, (min-width:640px) 50vw, 100vw"
                        placeholder="blur"
                        blurDataURL={showcase.image.blur}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute start-4 top-4 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-semibold text-gold-300 backdrop-blur">
                        {t(`${p}.title`)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg text-navy-800">{t(`${p}.body`)}</h3>
                      <Reveal stagger as="ul" className="mt-5 space-y-3">
                        {(['b1', 'b2', 'b3'] as const).map((b) => (
                          <RevealItem as="li" direction="inline-start" key={b} className="flex gap-3 text-sm text-ink/80">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-700">
                              <DirIcon icon={Check} className="h-3 w-3" strokeWidth={3} />
                            </span>
                            {t(`${p}.${b}`)}
                          </RevealItem>
                        ))}
                      </Reveal>
                      <Link
                        href={personaPath[p]}
                        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-navy-700 after:absolute after:inset-0 hover:text-gold-700"
                      >
                        {t(`${p}.cta`)}
                        <DirIcon icon={ArrowRight} flip className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </Link>
                    </div>
                  </article>
                </Tilt>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}
