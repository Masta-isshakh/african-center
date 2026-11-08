import { useTranslations } from 'next-intl';
import { Building2, Images, MapPin, Palette, Play, Shapes } from 'lucide-react';
import { areas, type Project } from '@/content/projects';
import type { Locale } from '@/i18n/routing';
import { Reveal } from '@/components/motion/Reveal';
import { DirIcon } from '@/components/ui/DirIcon';

/** Summary paragraph beside a compact spec sheet: location, style, type, programme and view count. */
export function ProjectOverview({ project, locale }: { project: Project; locale: Locale }) {
  const t = useTranslations('portfolio');
  const facts = [
    { key: 'location', icon: MapPin, value: areas[project.area].name[locale] },
    { key: 'style', icon: Palette, value: t(`styles.${project.style}`) },
    { key: 'type', icon: Shapes, value: t(`types.${project.type}`) },
    { key: 'views', icon: Images, value: t('imageCount', { count: project.images.length }), extra: project.video ? t('hasVideo') : null },
  ] as const;

  return (
    <section className="bg-sand py-14 sm:py-16 lg:py-20">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <p className="text-lg text-ink/80 sm:text-xl">{project.summary[locale]}</p>
        </Reveal>
        <Reveal className="lg:col-span-5" delay={120}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-mist bg-mist shadow-layered">
            {facts.map((f) => (
              <div key={f.key} className="bg-white p-5">
                <dt className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/55">
                  <DirIcon icon={f.icon} className="h-3.5 w-3.5 text-gold-700" />
                  {t(`facts.${f.key}`)}
                </dt>
                <dd className="mt-1.5 flex flex-wrap items-center gap-2 font-semibold text-navy-800">
                  <span>{f.value}</span>
                  {'extra' in f && f.extra && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold-50 px-2 py-0.5 text-xs text-gold-800">
                      <DirIcon icon={Play} className="h-3 w-3 fill-current" />
                      {f.extra}
                    </span>
                  )}
                </dd>
              </div>
            ))}
            {project.features.length > 0 && (
              <div className="col-span-2 bg-white p-5">
                <dt className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/55">
                  <DirIcon icon={Building2} className="h-3.5 w-3.5 text-gold-700" />
                  {t('facts.programme')}
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {project.features.map((feature) => (
                    <span key={feature} className="rounded-full border border-mist bg-sand px-3 py-1 text-sm font-medium text-navy-800">
                      {t(`features.${feature}`)}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
