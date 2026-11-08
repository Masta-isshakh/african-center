import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Project } from '@/content/projects';
import type { Locale } from '@/i18n/routing';
import { ButtonLink } from '@/components/ui/Button';
import { DirIcon } from '@/components/ui/DirIcon';
import { Reveal } from '@/components/motion/Reveal';
import { ProjectImage } from './ProjectImage';
import { cn } from '@/lib/utils';

function NavCard({ project, locale, direction }: { project: Project; locale: Locale; direction: 'prev' | 'next' }) {
  const t = useTranslations('portfolio.nav');
  const next = direction === 'next';
  return (
    <Link
      href={`/designs/${project.slug}`}
      className={cn('card-lift group flex items-center gap-4 rounded-xl border border-mist bg-white p-4', next && 'flex-row-reverse text-end')}
    >
      <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-navy-900">
        <ProjectImage image={project.cover} maxWidth={480} alt="" fill sizes="112px" placeholder="blur" blurDataURL={project.cover.blur} className="object-cover transition-transform duration-700 group-hover:scale-105" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn('inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink/55', next && 'flex-row-reverse')}>
          <DirIcon icon={next ? ArrowRight : ArrowLeft} flip className="h-3.5 w-3.5" />
          {t(direction)}
        </span>
        <span className="mt-1 block truncate font-bold text-navy-800">{project.title[locale]}</span>
      </span>
    </Link>
  );
}

/** Previous / next design plus a way back to the full grid. */
export function ProjectNav({ prev, next, locale }: { prev: Project; next: Project; locale: Locale }) {
  const t = useTranslations('portfolio.nav');
  return (
    <Reveal as="div">
      <nav aria-label={t('label')} className="grid gap-4 sm:grid-cols-2">
        <NavCard project={prev} locale={locale} direction="prev" />
        <NavCard project={next} locale={locale} direction="next" />
      </nav>
      <div className="mt-6 text-center">
        <ButtonLink href="/designs" variant="outline">
          <DirIcon icon={LayoutGrid} className="h-4 w-4" />
          {t('all')}
        </ButtonLink>
      </div>
    </Reveal>
  );
}
