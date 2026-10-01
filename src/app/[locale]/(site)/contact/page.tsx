import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';
import { TrustRow } from '@/components/ui/TrustRow';
import { ContactDetails, OfficeMap } from '@/components/sections/ContactSection';
import { ContactForm } from '@/components/sections/ContactForm';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'contact');
}

export default async function ContactPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contactPage' });
  const tc = await getTranslations({ locale, namespace: 'contact' });
  return (
    <>
      <PageHero locale={locale} crumbs={[{ name: t('eyebrow'), path: '/contact' }]} eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')}>
        <TrustRow dark />
      </PageHero>
      <section className="surface-topo py-16 sm:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <ContactDetails />
            <OfficeMap />
          </div>
          <div className="rounded-xl border border-mist bg-white p-6 shadow-layered sm:p-8 lg:col-span-7">
            <h2 className="text-display-lg font-bold text-navy-800">{tc('formTitle')}</h2>
            <p className="mt-2 text-ink/65">{tc('lead')}</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
