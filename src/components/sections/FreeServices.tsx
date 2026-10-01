import { useTranslations } from 'next-intl';
import { PencilRuler, FileSignature, ClipboardList, MessagesSquare, Calculator, Stamp, Users, Scale, Info, type LucideIcon } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { DirIcon } from '@/components/ui/DirIcon';
import { Reveal, RevealItem } from '@/components/motion/Reveal';

const services: { key: 'design' | 'contracts' | 'specs' | 'consulting' | 'budget' | 'permit' | 'sme' | 'mediation'; icon: LucideIcon }[] = [
  { key: 'design', icon: PencilRuler },
  { key: 'contracts', icon: FileSignature },
  { key: 'specs', icon: ClipboardList },
  { key: 'consulting', icon: MessagesSquare },
  { key: 'budget', icon: Calculator },
  { key: 'permit', icon: Stamp },
  { key: 'sme', icon: Users },
  { key: 'mediation', icon: Scale },
];

export function FreeServices() {
  const t = useTranslations('services');
  return (
    <Section id="services" tone="white" labelledBy="services-title">
      <div className="container-site">
        <SectionHeading id="services-title" align="center" eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <Reveal stagger amount={0.1} as="ul" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ key, icon }) => (
            <RevealItem as="li" key={key} className="card-lift group rounded-xl border border-mist bg-sand/60 p-6 hover:bg-white">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-navy-700 text-gold-300 transition-transform duration-300 group-hover:-rotate-6">
                <DirIcon icon={icon} className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 text-base text-navy-800">{t(`items.${key}.title`)}</h3>
              <p className="mt-2 text-sm text-ink/65">{t(`items.${key}.body`)}</p>
            </RevealItem>
          ))}
        </Reveal>
        <p className="mx-auto mt-10 flex max-w-3xl items-start justify-center gap-2 text-center text-sm text-ink/70">
          <DirIcon icon={Info} className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
          {t('footnote')}
        </p>
      </div>
    </Section>
  );
}
