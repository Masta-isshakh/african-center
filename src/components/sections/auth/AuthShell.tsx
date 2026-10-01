import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';

/** Dark hero band + overlapping white card that holds the auth form. */
export function AuthShell({ locale, crumb, path, eyebrow, title, lead, children }: { locale: Locale; crumb: string; path: string; eyebrow: string; title: string; lead: string; children: ReactNode }) {
  return (
    <>
      <PageHero locale={locale} compact crumbs={[{ name: crumb, path }]} eyebrow={eyebrow} title={title} lead={lead} />
      <section className="surface-topo pb-20">
        <div className="container-site">
          <div className="relative z-10 mx-auto -mt-6 max-w-3xl rounded-xl border border-mist bg-white p-6 shadow-lift sm:p-10">{children}</div>
        </div>
      </section>
    </>
  );
}
