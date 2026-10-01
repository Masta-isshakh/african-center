'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('errors.error');
  useEffect(() => {
    // Surface the failure for monitoring without exposing details to visitors.
    console.error(error);
  }, [error]);

  return (
    <section className="surface-dark flex min-h-[70svh] items-center pb-20 pt-[calc(var(--header-h)+3rem)]">
      <div className="container-site max-w-2xl">
        <h1 className="text-display-xl font-bold text-white">{t('title')}</h1>
        <p className="mt-4 text-lg text-white/70">{t('body')}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button size="lg" onClick={reset}>
            <DirIcon icon={RotateCcw} className="h-5 w-5" />
            {t('retry')}
          </Button>
          <ButtonLink href="/" variant="secondary" size="lg">
            {t('home')}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
