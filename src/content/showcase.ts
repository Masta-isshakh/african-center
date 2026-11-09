/**
 * Which company renders appear outside the portfolio: the home hero, the four "pick your role" cards
 * (also the persona page heroes) and the "walk through your villa" carousel. Keys refer to
 * scripts/projects.manifest.mjs; the build fails loudly if a referenced render disappears.
 */
import { projects, type Project } from './projects';
import type { ProjectImage, VariantSet } from './projects.types';
import type { Persona } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

export interface ShowcaseImage {
  project: Project;
  image: ProjectImage;
}

function pick(slug: string, key: string): ShowcaseImage {
  const project = projects.find((p) => p.slug === slug);
  const image = project?.images.find((i) => i.key === key);
  if (!project || !image) throw new Error(`Showcase render ${slug}/${key} not found — check scripts/projects.manifest.mjs`);
  return { project, image };
}

/**
 * Home-page hero backdrop: a centred blue-hour façade, so the villa stays visible beside the text column in both
 * reading directions and inside the portrait crop on phones. Not a project cover: the featured cards further down
 * the home page must not repeat it.
 */
export const heroShowcase = pick('al-shamal-modern-villa', 'front-facade-evening');

/** "Pick your role" cards on the home page and the hero image of each persona page. */
export const personaShowcase: Record<Persona, ShowcaseImage> = {
  owner: pick('sumaysimah-neo-classic-villa', 'front-facade-dusk'),
  contractor: pick('al-wakrah-modern-villa', 'aerial-plot-pool'),
  supplier: pick('al-gharrafa-modern-villa', 'front-facade-day'),
  consultant: pick('al-wakrah-classic-villa', 'front-elevation'),
};

/** "Walk through your villa before it is built": courtyards, pools, entrances and majlis interiors. */
export const walkthroughShowcase: ShowcaseImage[] = [
  pick('sumaysimah-neo-classic-villa', 'inner-courtyard'),
  pick('al-shamal-modern-villa', 'pool-courtyard-living'),
  pick('al-wakrah-modern-villa', 'entrance-walkway-pool'),
  pick('rawdat-al-jahhaniya-modern-villa', 'arrival-court'),
  pick('al-shahaniya-majlis', 'majlis-guests'),
  pick('al-wukair-neo-classic-villa', 'entrance-chandelier'),
  pick('sumaysimah-neo-classic-villa', 'shaded-terrace'),
  pick('al-shamal-modern-villa', 'pool-terrace-night'),
  pick('al-shahaniya-majlis', 'classic-majlis-chandelier'),
  pick('al-wakrah-modern-villa', 'pool-courtyard-night'),
];

/** Serialisable, localised card — what server components hand to client carousels. */
export interface ShowcaseCard {
  key: string;
  href: string;
  image: VariantSet & { blur: string; width: number; height: number };
  alt: string;
  caption: string;
  projectTitle: string;
}

export const toShowcaseCard = ({ project, image }: ShowcaseImage, locale: Locale): ShowcaseCard => ({
  key: `${project.slug}/${image.key}`,
  href: `/designs/${project.slug}`,
  image: { base: image.base, widths: image.widths, blur: image.blur, width: image.width, height: image.height },
  alt: `${image.caption[locale]} — ${project.title[locale]}`,
  caption: image.caption[locale],
  projectTitle: project.title[locale],
});

/** Alt text for a showcase render: its caption plus the project it belongs to. */
export const showcaseAlt = ({ project, image }: ShowcaseImage, locale: Locale) => `${image.caption[locale]} — ${project.title[locale]}`;
