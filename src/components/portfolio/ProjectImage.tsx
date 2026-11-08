'use client';

import Image, { type ImageProps } from 'next/image';
import type { VariantSet } from '@/content/projects.types';
import { variantSrc } from '@/lib/project-image';

type Props = Omit<ImageProps, 'src' | 'loader'> & {
  image: VariantSet;
  /** Largest variant this placement may request (the lightbox leaves it open so 4K screens get the 3840 px file). */
  maxWidth?: number;
};

/**
 * next/image over a pre-generated, content-hashed WebP set (see lib/project-image.ts and
 * scripts/prepare-projects.mjs). A client component so server components pass plain data
 * (`base` + `widths`) and the loader function stays on the client side.
 */
export function ProjectImage({ image, maxWidth, alt, ...props }: Props) {
  return <Image {...props} alt={alt} src={image.base} loader={({ width }) => variantSrc(image, maxWidth ? Math.min(width, maxWidth) : width)} />;
}
