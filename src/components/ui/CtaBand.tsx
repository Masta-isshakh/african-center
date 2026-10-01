import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import type { AnalyticsEvent } from '@/lib/analytics';
import { ButtonLink } from './Button';
import { DirIcon } from './DirIcon';
import { TrustRow } from './TrustRow';
import { Reveal } from '@/components/motion/Reveal';

interface Props {
  title: string;
  body?: string;
  cta: string;
  href: string;
  trackEvent?: AnalyticsEvent;
  trackProps?: Record<string, string>;
  children?: ReactNode;
}

/** Closing call to action on inner pages, with the trust micro-row under the button. */
export function CtaBand({ title, body, cta, href, trackEvent = 'cta_start_project', trackProps, children }: Props) {
  return (
    <section className="bg-sand py-20 sm:py-24">
      <div className="container-site">
        <Reveal className="surface-dark relative overflow-hidden rounded-xl px-6 py-14 text-center sm:px-12 lg:py-20">
          <div aria-hidden="true" className="absolute -top-24 start-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gold-500/15 blur-3xl rtl:translate-x-1/2" />
          <h2 className="relative mx-auto max-w-3xl text-display-xl font-bold text-white">{title}</h2>
          {body && <p className="relative mx-auto mt-5 max-w-xl text-lg text-white/75">{body}</p>}
          <div className="relative mt-9 flex flex-col items-center gap-6">
            <ButtonLink href={href} size="lg" trackEvent={trackEvent} trackProps={trackProps}>
              {cta}
              <DirIcon icon={ArrowRight} flip className="h-5 w-5" />
            </ButtonLink>
            <TrustRow dark align="center" />
          </div>
          {children && <div className="relative mt-12">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
