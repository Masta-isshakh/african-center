import type { MetadataRoute } from 'next';
import { brand } from '@/lib/brand';
import { media } from '@/lib/media';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name.ar,
    short_name: brand.shortName,
    description: brand.slogan.ar,
    start_url: '/ar',
    display: 'standalone',
    dir: 'rtl',
    lang: 'ar',
    background_color: brand.colors.sand,
    theme_color: brand.colors.navy,
    icons: media.logoMark
      ? [{ src: media.logoMark, sizes: '512x512', type: media.logoMark.endsWith('.svg') ? 'image/svg+xml' : 'image/png', purpose: 'any' }]
      : [
          { src: '/pwa-icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/apple-icon', sizes: '180x180', type: 'image/png', purpose: 'any' },
        ],
  };
}
