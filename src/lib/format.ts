import type { Locale } from '@/i18n/routing';

/**
 * Qatar convention: Arabic copy with Western (Latin) digits.
 * Flip to `true` to render Arabic-Indic digits (٠١٢٣…) across the Arabic site.
 */
export const ARABIC_DIGITS = false;

export function intlLocale(locale: Locale): string {
  if (locale === 'ar') return ARABIC_DIGITS ? 'ar-QA-u-ca-gregory' : 'ar-QA-u-ca-gregory-nu-latn';
  return 'en-QA';
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(intlLocale(locale), options).format(value);
}

/** `1,250 ر.ق` in Arabic, `QAR 1,250` in English. The label comes from `common.currency`. */
export function formatQar(value: number, locale: Locale, label: string, options?: Intl.NumberFormatOptions): string {
  const n = formatNumber(value, locale, { maximumFractionDigits: 0, ...options });
  return locale === 'ar' ? `${n} ${label}` : `${label} ${n}`;
}

export function formatDate(iso: string, locale: Locale, options: Intl.DateTimeFormatOptions = { dateStyle: 'long' }) {
  return new Intl.DateTimeFormat(intlLocale(locale), { timeZone: 'Asia/Qatar', ...options }).format(new Date(iso));
}

/** `+97470190099` → `+974 7019 0099` (always rendered inside a `dir="ltr"` element). */
export function formatPhone(e164: string): string {
  const m = e164.match(/^\+974(\d{4})(\d{4})$/);
  return m ? `+974 ${m[1]} ${m[2]}` : e164;
}

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

/** Live pulse only when prices were refreshed within the last 7 days. */
export function isFresh(iso: string | null, now: number = Date.now()): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) && now - t >= 0 && now - t <= SEVEN_DAYS;
}
