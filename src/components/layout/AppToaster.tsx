'use client';

import { Toaster } from 'sonner';
import { useLocale } from 'next-intl';

export function AppToaster() {
  const locale = useLocale();
  return (
    <Toaster
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      position="top-center"
      richColors
      closeButton
      toastOptions={{ className: 'font-body', style: { fontFamily: 'var(--font-tnr)' } }}
    />
  );
}
