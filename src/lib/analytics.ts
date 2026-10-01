export type AnalyticsEvent =
  | 'cta_start_project'
  | 'cta_register_persona'
  | 'whatsapp_click'
  | 'brief_step_completed'
  | 'brief_submitted'
  | 'contact_submitted'
  | 'materials_tab_opened'
  | 'design_lightbox_opened'
  | 'language_switched';

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || null;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || null;

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[track]', event, props);
  }
  if (GA_ID) window.gtag?.('event', event, props);
  if (META_PIXEL_ID) window.fbq?.('trackCustom', event, props);
}
