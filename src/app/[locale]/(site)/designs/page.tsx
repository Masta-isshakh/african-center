import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata, itemListJsonLd, localizedUrl } from '@/lib/seo';
import { siteUrl } from '@/lib/site';
import { media } from '@/lib/media';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';
import { CtaBand } from '@/components/ui/CtaBand';
import { JsonLd } from '@/components/ui/JsonLd';
import { DesignsGallery } from '@/components/sections/DesignsGallery';
import { useGalleryItems } from '@/components/sections/DesignsSection';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'designs');
}

function Gallery({ locale }: { locale: Locale }) {
  const items = useGalleryItems();
  return (
    <>
      <DesignsGallery items={items} showChips />
      <JsonLd
        data={itemListJsonLd(
          items.map((d) => ({
            name: d.title,
            url: `${localizedUrl(locale, '/designs')}#${d.slot}`,
            image: media[d.slot] ? `${siteUrl}${media[d.slot]}` : undefined,
          })),
        )}
      />
    </>
  );
}

export default async function DesignsPage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'designsPage' });
  const td = await getTranslations({ locale, namespace: 'designs' });
  return (
    <>
      <PageHero locale={locale} crumbs={[{ name: t('eyebrow'), path: '/designs' }]} eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
      <section className="bg-sand py-16 sm:py-20">
        <div className="container-site">
          <Gallery locale={locale} />
        </div>
      </section>
      <CtaBand title={td('requestSimilar')} body={td('lead')} cta={td('requestSimilar')} href="/start" trackProps={{ placement: 'designs_page' }} />
    </>
  );
}
