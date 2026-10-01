import { forwardRef, type ComponentProps } from 'react';
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

const nav = createNavigation(routing);

export const { redirect, usePathname, useRouter, getPathname } = nav;

/**
 * Locale-aware Link that prefetches on hover/intent instead of on viewport entry, so a page
 * full of CTAs doesn't download other routes before its own content has painted.
 */
export const Link = forwardRef<HTMLAnchorElement, ComponentProps<typeof nav.Link>>(function Link({ prefetch = false, ...props }, ref) {
  return <nav.Link ref={ref} prefetch={prefetch} {...props} />;
});
