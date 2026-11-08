import type { ProjectCardData } from '@/content/projects.types';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { ProjectCard } from './ProjectCard';

/** Static three-column grid with the CSS stagger reveal — used where no filtering is needed (home page). */
export function ProjectCardGrid({ items }: { items: ProjectCardData[] }) {
  return (
    <Reveal stagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <RevealItem as="li" key={p.slug}>
          <ProjectCard project={p} />
        </RevealItem>
      ))}
    </Reveal>
  );
}
