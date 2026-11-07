import type { MetadataRoute } from 'next';
import { routes } from '@/lib/site';
import { languageAlternates, localizedUrl } from '@/lib/seo';
import { projectSlugs } from '@/content/projects';
import { locales } from '@/i18n/routing';

/** Every route in both locales, each with ar-QA / en-QA / x-default alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths: string[] = [...routes, ...projectSlugs.map((slug) => `/designs/${slug}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified,
      changeFrequency: path === '' || path === '/materials' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path === '/start' || path === '/owners' ? 0.9 : path.startsWith('/designs/') ? 0.6 : 0.7,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
