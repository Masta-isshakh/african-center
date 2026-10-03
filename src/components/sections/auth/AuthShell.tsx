import type { ReactNode } from 'react';
import Image from 'next/image';
import { media } from '@/lib/media';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';

/** Dark hero band + overlapping white card that holds the auth form. */
export function AuthShell({ locale, crumb, path, eyebrow, title, lead, children }: { locale: Locale; crumb: string; path: string; eyebrow: string; title: string; lead: string; children: ReactNode }) {
  return (
    <>
      <PageHero locale={locale} compact crumbs={[{ name: crumb, path }]} eyebrow={eyebrow} title={title} lead={lead} />
      <section className="surface-topo pb-20">
        <div className="container-site">
          <div className="relative z-10 mx-auto -mt-6 max-w-3xl rounded-xl border border-mist bg-white p-6 shadow-lift sm:p-10">
            {media.logoMark && (
              <span className="relative mx-auto mb-6 block h-16 w-16">
                <Image src={media.logoMark} alt="" fill sizes="64px" className="object-contain" />
              </span>
            )}
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
