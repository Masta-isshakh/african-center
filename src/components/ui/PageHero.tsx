import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { breadcrumbJsonLd, localizedUrl } from '@/lib/seo';
import { DirIcon } from './DirIcon';
import { JsonLd } from './JsonLd';
import { cn } from '@/lib/utils';

export interface Crumb {
  name: string;
  path: string;
}

/** Visual breadcrumb + BreadcrumbList JSON-LD. Home is prepended automatically. */
export function Breadcrumbs({ locale, items }: { locale: Locale; items: Crumb[] }) {
  const t = useTranslations('common');
  const all: Crumb[] = [{ name: t('home'), path: '' }, ...items];
  return (
    <>
      <nav aria-label={t('breadcrumb')}>
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/55">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="inline-flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-white/85">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path || '/'} className="hover:text-gold-300">
                    {c.name}
                  </Link>
                )}
                {!last && <DirIcon icon={ChevronRight} flip className="h-3.5 w-3.5 opacity-60" />}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all.map((c) => ({ name: c.name, url: localizedUrl(locale, c.path) })))} />
    </>
  );
}

interface PageHeroProps {
  locale: Locale;
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  /** Right-hand (inline-end) column, e.g. a persona image */
  aside?: ReactNode;
  compact?: boolean;
}

/** Dark band that opens every inner page — keeps the transparent header legible and holds the page's single <h1>. */
export function PageHero({ locale, crumbs, eyebrow, title, lead, children, aside, compact }: PageHeroProps) {
  return (
    <section className={cn('surface-dark overflow-hidden pt-[calc(var(--header-h)+2.5rem)]', compact ? 'pb-14' : 'pb-20 lg:pb-24')}>
      <div aria-hidden="true" className="grid-fade absolute inset-0" />
      <div className={cn('container-site relative', aside && 'grid items-center gap-12 lg:grid-cols-12')}>
        <div className={cn(aside ? 'lg:col-span-7' : 'max-w-4xl')}>
          <Breadcrumbs locale={locale} items={crumbs} />
          <p className="eyebrow eyebrow-dark rise-in mt-8">{eyebrow}</p>
          <h1 className="rise-soft mt-5 text-display-xl font-extrabold text-white">
            {title}
          </h1>
          <span aria-hidden="true" className="gold-rule rise-in mt-7" style={{ ['--d' as string]: '160ms' }} />
          {lead && (
            <p className="rise-soft mt-7 max-w-2xl text-lg text-white/75">
              {lead}
            </p>
          )}
          {children && (
            <div className="rise-in mt-9" style={{ ['--d' as string]: '300ms' }}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="rise-in lg:col-span-5" style={{ ['--d' as string]: '200ms' }}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
