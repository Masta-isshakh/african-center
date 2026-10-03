import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock, ExternalLink, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { brand, filled } from '@/lib/brand';
import { formatPhone } from '@/lib/format';
import { telHref, mailHref, mapsHref } from '@/lib/contact';
import type { Locale } from '@/i18n/routing';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Media } from '@/components/ui/Media';
import { DirIcon } from '@/components/ui/DirIcon';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { ContactFormLazy } from '@/components/ui/LazyForms';

function InfoCard({ icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-lg border border-mist bg-white p-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-700 text-gold-300">
        <DirIcon icon={icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-ink/70">{title}</p>
        <div className="mt-1 text-[calc(0.9375rem*var(--fs))] font-medium text-navy-800">{children}</div>
      </div>
    </div>
  );
}

/** Office map: Google embed when configured, otherwise the map texture slot with a pin and a deep link. */
export function OfficeMap() {
  const t = useTranslations('contact');
  const embed = filled(brand.mapsEmbed);
  return (
    <div className="relative overflow-hidden rounded-xl border border-mist">
      {embed ? (
        <iframe src={embed} title={t('mapTitle')} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="aspect-[4/3] w-full border-0" allowFullScreen />
      ) : (
        <>
          <Media slot="mapTexture" alt={t('mapAlt')} sizes="(min-width:1024px) 40vw, 100vw" />
        </>
      )}
      <a
        href={mapsHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 end-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-navy-800 shadow-layered hover:bg-white"
      >
        {t('openInMaps')}
        <DirIcon icon={ExternalLink} className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

export function ContactDetails() {
  const t = useTranslations('contact');
  const locale = useLocale() as Locale;
  return (
    <Reveal stagger as="div" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <RevealItem>
        <InfoCard icon={MapPin} title={t('cards.address')}>
          {brand.address[locale]}
        </InfoCard>
      </RevealItem>
      <RevealItem>
        <InfoCard icon={Phone} title={t('cards.phones')}>
          <span className="flex flex-col">
            {brand.phones.map((p) => (
              <a key={p} href={telHref(p)} className="num hover:text-gold-700">
                {formatPhone(p)}
              </a>
            ))}
          </span>
        </InfoCard>
      </RevealItem>
      <RevealItem>
        <InfoCard icon={Mail} title={t('cards.email')}>
          <a href={mailHref()} className="num hover:text-gold-700 [overflow-wrap:anywhere]">
            {brand.email}
          </a>
        </InfoCard>
      </RevealItem>
      <RevealItem>
        <InfoCard icon={Clock} title={t('cards.hours')}>
          {brand.hours[locale]}
        </InfoCard>
      </RevealItem>
    </Reveal>
  );
}

export function ContactSection() {
  const t = useTranslations('contact');
  return (
    <Section id="contact" tone="sand" labelledBy="contact-title">
      <div className="container-site">
        <SectionHeading id="contact-title" eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <ContactDetails />
            <OfficeMap />
          </div>
          <div className="rounded-xl border border-mist bg-white p-6 shadow-layered sm:p-8 lg:col-span-7">
            <h3 className="font-display text-display-lg font-bold text-navy-800">{t('formTitle')}</h3>
            <div className="mt-6">
              <ContactFormLazy />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
