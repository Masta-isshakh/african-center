import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { brand } from '@/lib/brand';
import { formatPhone } from '@/lib/format';
import { telHref, mailHref } from '@/lib/contact';
import type { Locale } from '@/i18n/routing';
import { Wordmark } from '@/components/ui/Wordmark';
import { DirIcon } from '@/components/ui/DirIcon';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { AppBadges } from '@/components/ui/AppBadges';
import { NewsletterFormLazy } from '@/components/ui/LazyForms';

type FooterLink = 'how' | 'start' | 'designs' | 'materials' | 'projects' | 'owners' | 'contractors' | 'suppliers' | 'consultants' | 'about' | 'faq' | 'contact' | 'privacy' | 'terms';

const columns: { key: 'platform' | 'personas' | 'company' | 'legal'; links: { key: FooterLink; href: string }[] }[] = [
  {
    key: 'platform',
    links: [
      { key: 'how', href: '/#how' },
      { key: 'start', href: '/start' },
      { key: 'designs', href: '/designs' },
      { key: 'materials', href: '/materials' },
      { key: 'projects', href: '/projects' },
    ],
  },
  {
    key: 'personas',
    links: [
      { key: 'owners', href: '/owners' },
      { key: 'contractors', href: '/contractors' },
      { key: 'suppliers', href: '/suppliers' },
      { key: 'consultants', href: '/consultants' },
    ],
  },
  {
    key: 'company',
    links: [
      { key: 'about', href: '/about' },
      { key: 'faq', href: '/faq' },
      { key: 'contact', href: '/contact' },
    ],
  },
  {
    key: 'legal',
    links: [
      { key: 'privacy', href: '/privacy' },
      { key: 'terms', href: '/terms' },
    ],
  },
];

export function Footer() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const reg = { reg: brand.registration.number, disciplines: brand.registration.disciplines[locale], grade: brand.registration.grade[locale] };

  return (
    <footer className="surface-dark pb-24 pt-20 md:pb-10">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label={t('common.home')} className="inline-block">
              <Wordmark locale={locale} tone="light" variant="full" label={t('common.media.logo')} />
            </Link>
            <p className="mt-6 font-display text-lg text-white/90">{brand.slogan[locale]}</p>
            <p className="mt-1 text-sm tracking-wide text-gold-300">{brand.tagline[locale]}</p>
            <div className="mt-8">
              <p className="text-sm font-semibold text-white">{t('footer.newsletter.title')}</p>
              <p className="mb-3 mt-1 text-sm text-white/60">{t('footer.newsletter.body')}</p>
              <NewsletterFormLazy />
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-5">
            {columns.map((col) => (
              <div key={col.key}>
                <h2 className="font-body text-sm font-semibold text-gold-400">{t(`footer.columns.${col.key}`)}</h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.key}>
                      <Link href={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
                        {t(`footer.links.${l.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <address className="not-italic lg:col-span-3">
            <ul className="space-y-4 text-sm text-white/75">
              <li className="flex gap-3">
                <DirIcon icon={MapPin} className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>{brand.address[locale]}</span>
              </li>
              <li className="flex gap-3">
                <DirIcon icon={Phone} className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span className="flex flex-col gap-1">
                  {brand.phones.map((p) => (
                    <a key={p} href={telHref(p)} className="num hover:text-white">
                      {formatPhone(p)}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <DirIcon icon={Mail} className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a href={mailHref()} className="num hover:text-white">
                  {brand.email}
                </a>
              </li>
              <li className="flex gap-3">
                <DirIcon icon={Clock} className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>{brand.hours[locale]}</span>
              </li>
            </ul>
            <p className="mt-8 text-sm font-semibold text-white">{t('footer.follow')}</p>
            <SocialLinks className="mt-3" />
            <p className="mt-8 text-sm font-semibold text-white">{t('footer.apps')}</p>
            <AppBadges className="mt-3" />
          </address>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>{t('common.registrationLine', reg)}</p>
          <p>{t('footer.rights', { year: String(new Date().getFullYear()), name: brand.name[locale] })}</p>
        </div>
      </div>
    </footer>
  );
}
