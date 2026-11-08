import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { areas, type Project } from '@/content/projects';
import type { Locale } from '@/i18n/routing';
import { Breadcrumbs } from '@/components/ui/PageHero';
import { Chip } from '@/components/ui/Section';
import { DirIcon } from '@/components/ui/DirIcon';
import { ProjectImage } from './ProjectImage';

/** Full-bleed cover with the page's single <h1>, location and programme chips — the LCP image loads eagerly. */
export function ProjectHero({ project, locale }: { project: Project; locale: Locale }) {
  const t = useTranslations('portfolio');
  const td = useTranslations('designsPage');
  const title = project.title[locale];
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-white">
      <div className="absolute inset-0" aria-hidden="true">
        <ProjectImage image={project.cover} maxWidth={2560} alt="" fill priority sizes="100vw" placeholder="blur" blurDataURL={project.cover.blur} className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-navy-950/35 to-navy-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/65 via-navy-950/15 to-transparent rtl:bg-gradient-to-l" />
      </div>
      <div className="container-site relative flex min-h-[76svh] flex-col justify-end pb-14 pt-[calc(var(--header-h)+4.5rem)] lg:min-h-[82svh] lg:pb-20">
        <Breadcrumbs
          locale={locale}
          items={[
            { name: td('eyebrow'), path: '/designs' },
            { name: title, path: `/designs/${project.slug}` },
          ]}
        />
        <p className="eyebrow eyebrow-dark rise-in mt-8">{`${t(`styles.${project.style}`)} · ${t(`types.${project.type}`)}`}</p>
        <h1 className="rise-soft mt-5 max-w-4xl text-display-xl font-extrabold text-white">{title}</h1>
        <span aria-hidden="true" className="gold-rule rise-in mt-7" style={{ ['--d' as string]: '160ms' }} />
        <p className="rise-soft mt-6 inline-flex items-center gap-2 text-lg text-white/85">
          <DirIcon icon={MapPin} className="h-5 w-5 text-gold-300" />
          {areas[project.area].name[locale]}
        </p>
        {project.features.length > 0 && (
          <ul className="rise-in mt-6 flex flex-wrap gap-2" style={{ ['--d' as string]: '300ms' }} aria-label={t('facts.programme')}>
            {project.features.map((f) => (
              <li key={f}>
                <Chip tone="dark">{t(`features.${f}`)}</Chip>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
