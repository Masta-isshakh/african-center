import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, isLocale, dirOf, type Locale } from '@/i18n/routing';
import { brand } from '@/lib/brand';
import { siteUrl } from '@/lib/site';
import { organizationJsonLd, websiteJsonLd, titleSuffix } from '@/lib/seo';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { MobileCtaBar } from '@/components/layout/MobileCtaBar';
import { MaterialsTab } from '@/components/layout/MaterialsTab';
import { AppToasterLazy } from '@/components/ui/LazyForms';
import { Analytics } from '@/components/layout/Analytics';
import { JsonLd } from '@/components/ui/JsonLd';
import { cn } from '@/lib/utils';
import { bodoni, inter, arabicPreloads } from '@/lib/fonts';


/** Namespaces read by client components; server-only copy (meta, persona pages, legal…) stays on the server. */
const clientNamespaces = [
  'common',
  'nav',
  'whatsapp',
  'materials',
  'footer',
  'forms',
  'toasts',
  'testimonials',
  'designs',
  'designs360',
  'start',
  'contact',
  'auth',
  'faqPage',
  'faqItems',
  'projectsPage',
  'personaPage',
  'video',
  'errors',
] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: brand.colors.navy,
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return {
    metadataBase: new URL(siteUrl),
    title: { template: `%s | ${titleSuffix(locale)}`, default: `${t('title')} | ${brand.shortName}` },
    description: t('description'),
    applicationName: brand.name[locale],
    authors: [{ name: brand.name[locale] }],
    formatDetection: { telephone: false, email: false, address: false },
    category: 'construction',
  };
}

export default async function LocaleLayout({ children, params: { locale } }: { children: ReactNode; params: { locale: string } }) {
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const clientMessages: AbstractIntlMessages = Object.fromEntries(clientNamespaces.map((ns) => [ns, messages[ns]]));
  const t = await getTranslations('common');
  const l = locale as Locale;
  const credential = t('registrationLine', {
    reg: brand.registration.number,
    disciplines: brand.registration.disciplines[l],
    grade: brand.registration.grade[l],
  });

  return (
    <html lang={locale} dir={dirOf(l)} className={cn(bodoni.variable, inter.variable)} suppressHydrationWarning>
      <head>
        {/* Enables reveal-on-scroll hidden states only when JS runs; without JS everything stays visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {l === 'ar' &&
          arabicPreloads.map((href) => <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />)}
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
            <a
              href="#main"
              className="sr-only z-[100] rounded-md bg-gold-500 px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
            >
              {t('skipToContent')}
            </a>
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <FloatingActions />
            <MobileCtaBar />
            <MaterialsTab />
            <AppToasterLazy />
        </NextIntlClientProvider>
        <SmoothScroll />
        <JsonLd data={[organizationJsonLd(l, credential), websiteJsonLd(l)]} />
        <Analytics />
      </body>
    </html>
  );
}
