import localFont from 'next/font/local';

/**
 * Google Fonts, self-hosted so builds never wait on fonts.googleapis.com.
 * Latin faces (Bodoni Moda, Inter) go through next/font and preload in both locales.
 * Arabic faces (Cairo, IBM Plex Sans Arabic) are declared in globals.css from /public/fonts so the
 * Arabic layout can preload exactly the two faces above the fold — English pages never fetch them.
 */
export const arabicPreloads = ['/fonts/cairo-800.woff2', '/fonts/plex-arabic-400.woff2'] as const;

export const bodoni = localFont({
  src: [{ path: '../assets/fonts/web/bodoni-moda-700.woff2', weight: '700', style: 'normal' }],
  variable: '--font-bodoni',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
  fallback: ['Didot', 'Georgia', 'serif'],
});

export const inter = localFont({
  src: [
    // Two weights cover body (400) and every medium/semibold/bold use (500–700 resolve to 600).
    { path: '../assets/fonts/web/inter-400.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/web/inter-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});
