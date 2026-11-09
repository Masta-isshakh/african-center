import { useTranslations } from 'next-intl';
import { ArrowUpRight, MapPin, Play } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { ProjectCardData } from '@/content/projects.types';
import { Chip } from '@/components/ui/Section';
import { DirIcon } from '@/components/ui/DirIcon';
import { ProjectImage } from './ProjectImage';
import { cn } from '@/lib/utils';

interface Props {
  project: ProjectCardData;
  /** Above-the-fold covers load eagerly */
  priority?: boolean;
  /** Small gold chip over the cover (e.g. the project's stage) */
  badge?: string;
  className?: string;
}

/** Cover, location, style/type chips and the programme line — the whole card is one link to the project page. */
export function ProjectCard({ project, priority, badge, className }: Props) {
  const t = useTranslations('portfolio');
  return (
    <article className={cn('group h-full', className)}>
      <Link
        href={`/designs/${project.slug}`}
        aria-label={t('cardLabel', { title: project.title, location: project.location })}
        className="card-lift flex h-full flex-col overflow-hidden rounded-xl border border-mist bg-white"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-navy-900">
          <ProjectImage
            image={project.cover}
            maxWidth={1440}
            alt={project.cover.alt}
            fill
            sizes="(min-width:1024px) 31vw, (min-width:640px) 48vw, 95vw"
            priority={priority}
            placeholder="blur"
            blurDataURL={project.cover.blur}
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
          {badge && <span className="absolute start-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-navy-950">{badge}</span>}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
            <p className="inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold">
              <DirIcon icon={MapPin} className="h-4 w-4 shrink-0 text-gold-300" />
              <span className="truncate">{project.location}</span>
            </p>
            <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold">
              {project.hasVideo && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-500 px-2 py-0.5 text-navy-950">
                  <DirIcon icon={Play} className="h-3 w-3 fill-current" />
                  {t('hasVideo')}
                </span>
              )}
              <span className="rounded-full border border-white/25 bg-navy-950/50 px-2.5 py-0.5 backdrop-blur">{t('imageCount', { count: project.imageCount })}</span>
            </span>
          </div>
          <span className="absolute end-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-navy-950/60 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <DirIcon icon={ArrowUpRight} flip className="h-4 w-4" />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="gold">{t(`styles.${project.style}`)}</Chip>
            <Chip>{t(`types.${project.type}`)}</Chip>
          </div>
          <h3 className="mt-3 text-lg font-bold text-navy-800">{project.title}</h3>
          {project.features.length > 0 && <p className="mt-1.5 text-sm text-ink/65">{project.features.map((f) => t(`features.${f}`)).join(' · ')}</p>}
        </div>
      </Link>
    </article>
  );
}
