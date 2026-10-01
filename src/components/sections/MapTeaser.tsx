import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { QatarMap, type MapPoint } from '@/components/ui/QatarMap';
import { Reveal } from '@/components/motion/Reveal';

export const serviceCities: (Omit<MapPoint, 'label'> & { id: 'alRayyan' | 'doha' | 'alWakrah' | 'lusail' | 'alKhor' })[] = [
  { id: 'alKhor', lat: 25.68, lng: 51.5, labelSide: 'start' },
  { id: 'lusail', lat: 25.42, lng: 51.51, labelSide: 'start' },
  { id: 'alRayyan', lat: 25.29, lng: 51.42, labelSide: 'start' },
  { id: 'doha', lat: 25.29, lng: 51.53, labelSide: 'end' },
  { id: 'alWakrah', lat: 25.17, lng: 51.6, labelSide: 'start' },
];

export function MapTeaser() {
  const t = useTranslations('map');
  const points: MapPoint[] = serviceCities.map((c) => ({ ...c, label: t(`cities.${c.id}`) }));
  return (
    <Section tone="dark" labelledBy="map-title" className="overflow-hidden">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading id="map-title" dark eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />
          <ButtonLink href="/projects" className="mt-10">
            {t('cta')}
            <DirIcon icon={ArrowRight} flip className="h-4 w-4" />
          </ButtonLink>
        </div>
        <Reveal className="mx-auto w-full max-w-sm lg:max-w-md">
          <QatarMap points={points} label={t('mapLabel')} />
        </Reveal>
      </div>
    </Section>
  );
}
