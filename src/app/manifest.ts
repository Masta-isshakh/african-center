import type { MetadataRoute } from 'next';
import { brand } from '@/lib/brand';

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
    icons: [
      { src: '/pwa-icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png', purpose: 'any' },
    ],
  };
}
