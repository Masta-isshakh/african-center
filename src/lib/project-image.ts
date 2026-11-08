import type { VariantSet } from '@/content/projects.types';

/**
 * Project renders are static, content-hashed WebP sets written by scripts/prepare-projects.mjs
 * (`${base}-${width}.webp`), so nothing is encoded at request time and every file is cached as immutable.
 * Returns the smallest pre-generated width that covers the requested one, or the largest available.
 */
export function variantSrc({ base, widths }: VariantSet, width: number) {
  const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
  return `${base}-${w}.webp`;
}
