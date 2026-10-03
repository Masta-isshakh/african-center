import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { media } from '@/lib/media';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { BlueprintVilla } from '@/components/ui/BlueprintVilla';

export default function NotFound() {
  const t = useTranslations('errors.notFound');
  return (
    <section className="surface-dark relative flex min-h-[80svh] items-center overflow-hidden pb-20 pt-[calc(var(--header-h)+3rem)]">
      <BlueprintVilla className="absolute -bottom-10 end-0 w-[min(900px,110%)] opacity-15" />
      <div className="container-site relative">
        {media.logoMark && (
          <span className="relative mb-6 block h-20 w-20">
            <Image src={media.logoMark} alt="" fill sizes="80px" className="object-contain" />
          </span>
        )}
        <p className="num text-outline-gold font-display text-[clamp(6rem,18vw,12rem)] font-extrabold leading-none">{t('code')}</p>
        <h1 className="mt-4 text-display-xl font-bold text-white">{t('title')}</h1>
        <p className="mt-4 max-w-xl text-lg text-white/70">{t('body')}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/" size="lg">
            {t('home')}
            <DirIcon icon={ArrowRight} flip className="h-5 w-5" />
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" size="lg">
            {t('contact')}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
