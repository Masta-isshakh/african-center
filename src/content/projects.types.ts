/**
 * Shared shapes for the design portfolio. This module has no heavy imports, so client components can
 * import constants and types from here without pulling the generated media manifest into the bundle.
 * Hand-written metadata lives in projects.ts; images, drawings and video in projects.generated.ts.
 */

export type Bilingual = { en: string; ar: string };

export const imageCategories = ['exterior', 'aerial', 'outdoor', 'interior', 'detail'] as const;
export type ImageCategory = (typeof imageCategories)[number];

export type ProjectStyle = 'modern' | 'neoClassic' | 'classic';
export type ProjectType = 'villa' | 'majlis';
/** Floors and components, in the order they are listed in the brief */
export type ProjectFeature = 'ground' | 'first' | 'roof' | 'penthouse' | 'outdoorMajlis' | 'majlis' | 'driverRoom' | 'annex' | 'pool';

export const projectStyles: ProjectStyle[] = ['modern', 'neoClassic', 'classic'];
export const projectFilters = ['all', ...projectStyles] as const;
export type ProjectFilter = (typeof projectFilters)[number];

/** A pre-generated, content-hashed WebP set: files live at `${base}-${width}.webp` for each of `widths`. */
export interface VariantSet {
  /** e.g. `/media/projects/<slug>/01-entrance-portal-9cfbe5b1` */
  base: string;
  /** Available widths, ascending (never larger than the source) */
  widths: number[];
}

export interface ProjectImage extends VariantSet {
  /** Stable id from the manifest, e.g. `entrance-portal` */
  key: string;
  /** Largest variant — for Open Graph images, JSON-LD and plain links */
  src: string;
  /** Source dimensions (aspect ratio) */
  width: number;
  height: number;
  /** Inline WebP data URL used as the next/image blur placeholder */
  blur: string;
  category: ImageCategory;
  caption: Bilingual;
}

export interface ProjectVideoAsset {
  /** Largest first: 1080p then 720p */
  sources: { src: string; width: number; height: number }[];
  poster: ProjectImage;
  /** Seconds */
  duration: number;
}

export interface GeneratedProjectMedia {
  images: ProjectImage[];
  video: ProjectVideoAsset | null;
}

/** A project image with its caption already resolved for the current locale (what the gallery and lightbox render). */
export interface GalleryImage extends VariantSet {
  key: string;
  src: string;
  width: number;
  height: number;
  blur: string;
  category: ImageCategory;
  alt: string;
}

/** Localised, serialisable subset of a project for cards — safe to pass from server to client components. */
export interface ProjectCardData {
  slug: string;
  title: string;
  location: string;
  excerpt: string;
  style: ProjectStyle;
  type: ProjectType;
  features: ProjectFeature[];
  cover: VariantSet & { src: string; alt: string; blur: string; width: number; height: number };
  imageCount: number;
  hasVideo: boolean;
}
