import { renderProjectOg, ogSize } from '@/lib/og';
import { brand } from '@/lib/brand';
import type { Locale } from '@/i18n/routing';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = `${brand.name.en} — ${brand.name.ar}`;

export default function Image({ params: { locale, slug } }: { params: { locale: Locale; slug: string } }) {
  return renderProjectOg(locale, slug);
}
