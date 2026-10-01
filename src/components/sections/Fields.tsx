import { useTranslations } from 'next-intl';
import { Home, KeyRound, Building2, Hammer, PaintRoller, HardHat, Truck, Compass, type LucideIcon } from 'lucide-react';
import { pad2 } from '@/lib/utils';
import { Section, SectionHeading } from '@/components/ui/Section';
import { DirIcon } from '@/components/ui/DirIcon';
import { Reveal, RevealItem } from '@/components/motion/Reveal';

const fields: { key: 'villas' | 'loanVillas' | 'commercial' | 'renovation' | 'interiors' | 'supervision' | 'supplyTenders' | 'consulting'; icon: LucideIcon }[] = [
  { key: 'villas', icon: Home },
  { key: 'loanVillas', icon: KeyRound },
  { key: 'commercial', icon: Building2 },
  { key: 'renovation', icon: Hammer },
  { key: 'interiors', icon: PaintRoller },
  { key: 'supervision', icon: HardHat },
  { key: 'supplyTenders', icon: Truck },
  { key: 'consulting', icon: Compass },
];

export function Fields() {
  const t = useTranslations('fields');
  return (
    <Section tone="topo" labelledBy="fields-title">
      <div className="container-site">
        <SectionHeading id="fields-title" eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <Reveal stagger amount={0.1} as="ul" className="mt-14 grid gap-px overflow-hidden rounded-xl border border-mist bg-mist sm:grid-cols-2 lg:grid-cols-4">
          {fields.map(({ key, icon }, i) => (
            <RevealItem as="li" key={key} className="group relative bg-white p-7 transition-colors duration-300 hover:bg-navy-950">
              <span className="absolute end-6 top-6 font-display text-sm text-gold-700 transition-colors group-hover:text-gold-400">
                <span className="num">{pad2(i + 1)}</span>
              </span>
              <DirIcon icon={icon} className="h-8 w-8 text-gold-700 transition-colors group-hover:text-gold-400" strokeWidth={1.4} />
              <h3 className="mt-6 text-base text-navy-800 transition-colors group-hover:text-white">{t(`items.${key}.title`)}</h3>
              <p className="mt-2 text-sm text-ink/65 transition-colors group-hover:text-white/70">{t(`items.${key}.body`)}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
