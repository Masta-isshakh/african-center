import { setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { Divider } from '@/components/ui/Divider';
import { Hero } from '@/components/sections/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { Personas } from '@/components/sections/Personas';
import { AboutStory } from '@/components/sections/AboutStory';
import { Fields } from '@/components/sections/Fields';
import { Process } from '@/components/sections/Process';
import { DesignsSection, Designs360Section } from '@/components/sections/DesignsSection';
import { FreeServices } from '@/components/sections/FreeServices';
import { MaterialsTeaser } from '@/components/sections/MaterialsTeaser';
import { MapTeaser } from '@/components/sections/MapTeaser';
import { Testimonials } from '@/components/sections/Testimonials';
import { AppBand } from '@/components/sections/AppBand';
import { ContactSection } from '@/components/sections/ContactSection';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  return pageMetadata(locale, 'home');
}

export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <TrustStrip />
      <Personas />
      <AboutStory />
      <Fields />
      <Divider from="sand" to="charcoal" />
      <Process />
      <Divider from="charcoal" to="sand" shape="curve" />
      <DesignsSection />
      <Divider from="sand" to="charcoal" />
      <Designs360Section />
      <Divider from="charcoal" to="white" shape="curve" />
      <FreeServices />
      <MaterialsTeaser />
      <Divider from="sand" to="charcoal" />
      <MapTeaser />
      <Divider from="charcoal" to="sand" shape="curve" />
      <Testimonials />
      <AppBand />
      <ContactSection />
      <Divider from="sand" to="charcoal" />
    </>
  );
}
