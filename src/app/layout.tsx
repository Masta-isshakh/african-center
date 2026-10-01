import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import './globals.css';

// Resolves absolute URLs for metadata routes that live outside [locale] (icons, manifest).
export const metadata: Metadata = { metadataBase: new URL(siteUrl) };

// The <html> element lives in [locale]/layout.tsx so `lang` and `dir` follow the route.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
