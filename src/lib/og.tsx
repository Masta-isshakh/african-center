import type { ReactNode } from 'react';
import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getTranslations } from 'next-intl/server';
import { brand } from './brand';
import { media } from './media';
import type { MetaPage } from './seo';
import type { Locale } from '@/i18n/routing';

export const ogSize = { width: 1200, height: 630 };

// OG images are rendered on the server, where Times New Roman isn't installed (and can't be bundled):
// Tinos is its metric-compatible open twin, Noto Naskh Arabic matches its Naskh-style Arabic.
const font = (file: string) => readFile(path.join(process.cwd(), 'src/assets/fonts', file));

type FontSpec = { name: string; data: Buffer; weight: 400 | 700; style: 'normal' };

/**
 * satori (JSX → SVG) + sharp (SVG → PNG). Used instead of `next/og`, whose Node build
 * resolves its own assets with `path.join(import.meta.url)` and crashes on Windows.
 */
async function png(node: ReactNode, width: number, height: number, fonts: FontSpec[]) {
  const svg = await satori(node, { width, height, fonts });
  const body = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(body), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}

async function backdrop(): Promise<string | null> {
  if (!media.ogDefault) return null;
  const file = await readFile(path.join(process.cwd(), 'public', media.ogDefault));
  const ext = path.extname(media.ogDefault).slice(1).replace('jpg', 'jpeg');
  return `data:image/${ext};base64,${file.toString('base64')}`;
}

const fontPath = (file: string) => path.join(process.cwd(), 'src/assets/fonts', file);

const escapeMarkup = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * satori draws Arabic glyphs but measures words with unshaped widths (wide gaps, LTR word order).
 * Arabic runs are therefore rasterised by sharp's Pango/HarfBuzz text renderer and embedded as images.
 * In an RTL paragraph Pango's `left` alignment is the reading start, i.e. flush right.
 */
async function arabicRun(text: string, sizePx: number, maxWidth: number, color = '#ffffff') {
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${color}">${escapeMarkup(text)}</span>`,
      font: `Noto Naskh Arabic Bold ${sizePx}`,
      fontfile: fontPath('noto-naskh-arabic-700.ttf'),
      width: maxWidth,
      align: 'left',
      wrap: 'word',
      rgba: true,
      dpi: 72,
      spacing: Math.round(sizePx * 0.25),
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { src: `data:image/png;base64,${data.toString('base64')}`, width: info.width, height: info.height };
}

/** Navy card, gold rule, localized page title, wordmark at the bottom-start corner. */
export async function renderOg(locale: Locale, page: MetaPage) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const title = t(`${page}.title`, { reg: brand.registration.number });
  const ar = locale === 'ar';
  const [tinosBold, tinos, bg, arTitle, arName] = await Promise.all([
    font('tinos-700.ttf'),
    font('tinos-400.ttf'),
    backdrop(),
    ar ? arabicRun(title, 72, 1000) : null,
    arabicRun(brand.name.ar, 30, 900),
  ]);
  const align = ar ? 'flex-end' : 'flex-start';

  return png(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: align,
          padding: '72px 80px',
          background: 'radial-gradient(ellipse at 30% 0%, #0a3a66 0%, #052F57 45%, #02101F 100%)',
          color: '#fff',
          position: 'relative',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by satori, not the browser */}
        {bg && <img src={bg} width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover', opacity: 0.25 }} alt="" />}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: align }}>
          <div style={{ fontFamily: 'Tinos', fontSize: 22, letterSpacing: 6, color: '#DFB95C' }}>{brand.shortName}</div>
          {arTitle ? (
            /* eslint-disable-next-line @next/next/no-img-element -- rendered by satori, not the browser */
            <img src={arTitle.src} width={arTitle.width} height={arTitle.height} style={{ marginTop: 28 }} alt="" />
          ) : (
            <div style={{ marginTop: 28, fontFamily: 'Tinos', fontWeight: 700, fontSize: title.length > 40 ? 64 : 76, lineHeight: 1.08, maxWidth: 1000 }}>{title}</div>
          )}
          <div style={{ marginTop: 36, width: 120, height: 3, background: 'linear-gradient(90deg, #C99A2E, #DFB95C)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: align }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by satori, not the browser */}
          <img src={arName.src} width={arName.width} height={arName.height} alt="" />
          <div style={{ marginTop: 6, fontFamily: 'Tinos', fontWeight: 700, fontSize: 34, color: '#fff' }}>{brand.wordmark.line1}</div>
          <div style={{ marginTop: 4, fontFamily: 'Tinos', fontSize: 14, letterSpacing: 4, color: '#DFB95C' }}>{brand.wordmark.line2}</div>
        </div>
      </div>
    ),
    ogSize.width,
    ogSize.height,
    [
      { name: 'Tinos', data: tinosBold, weight: 700, style: 'normal' },
      { name: 'Tinos', data: tinos, weight: 400, style: 'normal' },
    ],
  );
}

/** Monogram used for the favicon / touch icon until `media.logoMark` exists. */
export async function renderIcon(size: number) {
  const tinosBold = await font('tinos-700.ttf');
  return png(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#052F57',
          border: `${Math.max(2, size / 40)}px solid #C99A2E`,
          borderRadius: size / 6,
          color: '#DFB95C',
          fontFamily: 'Tinos',
          fontSize: size * 0.62,
          lineHeight: 1,
        }}
      >
        A
      </div>
    ),
    size,
    size,
    [{ name: 'Tinos', data: tinosBold, weight: 700, style: 'normal' }],
  );
}
