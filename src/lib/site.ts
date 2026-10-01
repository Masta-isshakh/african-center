import { brand, filled } from './brand';

/** Canonical origin: env override → configured domain → local dev. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (filled(brand.domain) ? `https://${filled(brand.domain)}` : 'http://localhost:3000')
).replace(/\/$/, '');

/** Every public route (without locale prefix). Drives the sitemap. */
export const routes = [
  '',
  '/owners',
  '/contractors',
  '/suppliers',
  '/consultants',
  '/start',
  '/designs',
  '/projects',
  '/materials',
  '/faq',
  '/about',
  '/contact',
  '/sign-in',
  '/sign-up',
  '/privacy',
  '/terms',
] as const;

export type AppRoute = (typeof routes)[number];

export type NavKey = 'home' | 'how' | 'owners' | 'contractors' | 'designs' | 'materials' | 'projects' | 'faq' | 'contact';

/** Header navigation. `section` items are scroll-spied on the home page. */
export const navItems: { key: NavKey; href: string; section?: string }[] = [
  { key: 'home', href: '/', section: 'top' },
  { key: 'how', href: '/#how', section: 'how' },
  { key: 'owners', href: '/owners' },
  { key: 'contractors', href: '/contractors' },
  { key: 'designs', href: '/designs' },
  { key: 'materials', href: '/materials' },
  { key: 'projects', href: '/projects' },
  { key: 'faq', href: '/faq' },
  { key: 'contact', href: '/contact' },
];

export type Persona = 'owner' | 'contractor' | 'supplier' | 'consultant';
export const personas: Persona[] = ['owner', 'contractor', 'supplier', 'consultant'];

export const personaPath: Record<Persona, '/owners' | '/contractors' | '/suppliers' | '/consultants'> = {
  owner: '/owners',
  contractor: '/contractors',
  supplier: '/suppliers',
  consultant: '/consultants',
};

/** Owners start with a project brief; the other personas register. */
export const personaCta: Record<Persona, string> = {
  owner: '/start',
  contractor: '/sign-up?persona=contractor',
  supplier: '/sign-up?persona=supplier',
  consultant: '/sign-up?persona=consultant',
};

export function isPersona(value: unknown): value is Persona {
  return typeof value === 'string' && (personas as string[]).includes(value);
}
