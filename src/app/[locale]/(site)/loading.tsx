import { useTranslations } from 'next-intl';

/** Mirrors the inner-page hero so route changes don't flash an empty page. */
export default function Loading() {
  const t = useTranslations('common');
  return (
    <section aria-busy="true" className="surface-dark pb-20 pt-[calc(var(--header-h)+4.5rem)]">
      <div className="container-site max-w-4xl space-y-6">
        <span className="sr-only">{t('loading')}</span>
        <div className="shimmer-panel h-4 w-40 rounded-full" />
        <div className="shimmer-panel h-14 w-full max-w-2xl rounded-lg" />
        <div className="shimmer-panel h-5 w-full max-w-xl rounded-full" />
      </div>
    </section>
  );
}
