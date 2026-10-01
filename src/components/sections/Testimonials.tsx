import { useLocale, useTranslations } from 'next-intl';
import { Instagram, Quote } from 'lucide-react';
import { brand, filled } from '@/lib/brand';
import { showSampleContent } from '@/lib/utils';
import { sampleTestimonials } from '@/content/samples';
import type { Locale } from '@/i18n/routing';
import { Section, SectionHeading } from '@/components/ui/Section';
import { DirIcon } from '@/components/ui/DirIcon';
import { Reveal } from '@/components/motion/Reveal';
import { TestimonialSlider } from './TestimonialSlider';

/** Sample stories render only in preview mode; otherwise an honest empty state. */
export function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale() as Locale;
  const instagram = filled(brand.social.instagram);

  return (
    <Section tone="topo" labelledBy="testimonials-title">
      <div className="container-site">
        <SectionHeading id="testimonials-title" align="center" eyebrow={t('eyebrow')} title={t('title')} />
        <div className="mt-14">
          {showSampleContent ? (
            <TestimonialSlider
              items={sampleTestimonials.map((s) => ({ id: s.id, name: s.name[locale], role: s.role[locale], quote: s.quote[locale] }))}
            />
          ) : (
            <Reveal className="mx-auto max-w-2xl rounded-xl border border-dashed border-gold-500/40 bg-white/70 p-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy-700 text-gold-300">
                <DirIcon icon={Quote} flip className="h-6 w-6" />
              </span>
              <h3 className="mt-6 font-display text-display-lg font-bold text-navy-800">{t('emptyTitle')}</h3>
              <p className="mt-3 text-ink/70">{t('emptyBody')}</p>
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-navy-700 hover:text-gold-700">
                  <DirIcon icon={Instagram} className="h-5 w-5" />
                  {t('followInstagram')}
                </a>
              )}
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
