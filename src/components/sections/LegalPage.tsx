import { getTranslations } from 'next-intl/server';
import { AlertTriangle } from 'lucide-react';
import { brand } from '@/lib/brand';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';
import { DirIcon } from '@/components/ui/DirIcon';

const sectionKeys = ['s1', 's2', 's3', 's4'] as const;

/** Short, honest legal placeholder pending review. Shared by /privacy and /terms. */
export async function LegalPage({ locale, doc }: { locale: Locale; doc: 'privacy' | 'terms' }) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  return (
    <>
      <PageHero locale={locale} compact crumbs={[{ name: t(`${doc}.title`), path: `/${doc}` }]} eyebrow={t(`${doc}.eyebrow`)} title={t(`${doc}.title`)} />
      <section className="bg-sand py-16 sm:py-20">
        <div className="container-site max-w-3xl">
          <p role="note" className="flex items-start gap-3 rounded-lg border border-warning/40 bg-amber-50 p-4 text-sm text-amber-900">
            <DirIcon icon={AlertTriangle} className="mt-0.5 h-5 w-5 shrink-0" />
            {t('reviewNote')}
          </p>
          <div className="mt-10 space-y-10">
            {sectionKeys.map((k, i) => (
              <section key={k} aria-labelledby={`${doc}-${k}`}>
                <h2 id={`${doc}-${k}`} className="flex items-baseline gap-3 text-display-lg font-bold text-navy-800">
                  <span className="num text-base text-gold-700">{`0${i + 1}`}</span>
                  {t(`${doc}.sections.${k}.title`)}
                </h2>
                <p className="mt-3 text-ink/80">{t(`${doc}.sections.${k}.body`, { email: brand.email })}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
