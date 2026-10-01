/**
 * Single source of truth for every fact shown on the site.
 * Values that have not been confirmed by ACEC are `null` or a visible `[BRACKET]` string.
 * Never replace a placeholder with an estimate — fill it with the confirmed value or leave it.
 */
export const brand = {
  name: { ar: 'المركز الأفريقي للاستشارات الهندسية', en: 'African Center for Engineering Consultancy' },
  shortName: 'ACEC',
  /** Letterhead logotype lines (typeset fallback until the logo files arrive) */
  wordmark: { line1: 'AFRICAN CENTER', line2: 'FOR ENGINEERING CONSULTANCY' },
  tagline: { ar: 'تصميم · إشراف · إستشارات', en: 'Design · Supervision · Consultancy' },
  slogan: { ar: 'نبني مستقبلاً أفضل بأفكار هندسية', en: 'Building a better future with engineering ideas' },
  registration: {
    number: '406',
    disciplines: { ar: 'هندسة معمارية وهندسة مدنية', en: 'Architecture & Civil Engineering' },
    grade: { ar: 'الفئة الثالثة', en: 'Grade 3' },
  },
  foundingYear: '[FOUNDING_YEAR]',
  domain: '[DOMAIN]',
  address: {
    ar: 'الريان – شارع آل شافي – مقابل بنك دخان، الدوحة، قطر',
    en: 'Al Rayyan, Al Shafi Street, opposite Dukhan Bank, Doha, Qatar',
  },
  locality: { ar: 'الريان', en: 'Al Rayyan' },
  geo: { lat: 25.2919, lng: 51.4244 }, // Al Rayyan approx — replace with exact pin
  phones: ['+97470190099', '+97431103327'],
  whatsapp: '[WHATSAPP_NUMBER]',
  email: 'ACEC60@outlook.com',
  hours: { ar: 'الأحد – الخميس، 8:00 ص – 5:00 م', en: 'Sun–Thu, 8:00 AM – 5:00 PM' },
  /** schema.org openingHours for the hours above */
  openingHours: 'Su-Th 08:00-17:00',
  /** Google Maps "Embed a map" iframe src URL */
  mapsEmbed: '[GOOGLE_MAPS_EMBED]',
  social: {
    instagram: '[SOCIAL_INSTAGRAM]',
    linkedin: '[SOCIAL_LINKEDIN]',
    x: '[SOCIAL_X]',
    youtube: '[SOCIAL_YOUTUBE]',
    facebook: '[SOCIAL_FACEBOOK]',
  },
  /** App store listing URLs — badges stay unlinked with a "Coming soon" chip until set */
  apps: { appStore: '[APP_STORE_URL]', googlePlay: '[GOOGLE_PLAY_URL]' },
  stats: { projects: null, designs: null, contractors: null, totalValueQar: null }, // null → launch mode
  commissionPercent: null, // null → "agreed on award"
  colors: { navy: '#052F57', gold: '#C99A2E', charcoal: '#101418', sand: '#F7F4EE' },
} as const satisfies BrandShape;

type Localized = { readonly ar: string; readonly en: string };

interface BrandShape {
  name: Localized;
  shortName: string;
  wordmark: { line1: string; line2: string };
  tagline: Localized;
  slogan: Localized;
  registration: { number: string; disciplines: Localized; grade: Localized };
  foundingYear: string;
  domain: string;
  address: Localized;
  locality: Localized;
  geo: { lat: number; lng: number };
  phones: readonly string[];
  whatsapp: string;
  email: string;
  hours: Localized;
  openingHours: string;
  mapsEmbed: string;
  social: Record<'instagram' | 'linkedin' | 'x' | 'youtube' | 'facebook', string>;
  apps: Record<'appStore' | 'googlePlay', string>;
  stats: Record<'projects' | 'designs' | 'contractors' | 'totalValueQar', number | null>;
  commissionPercent: number | null;
  colors: Record<'navy' | 'gold' | 'charcoal' | 'sand', string>;
}

export type SocialNetwork = keyof typeof brand.social;

/** True for unfilled values such as `[DOMAIN]`. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return value == null || /^\[[A-Z0-9_]+\]$/.test(value.trim());
}

/** Returns the value only when it has been filled in. */
export function filled(value: string | null | undefined): string | null {
  return isPlaceholder(value) ? null : (value as string);
}

/** Stats are only shown once every counter has a confirmed value. */
export function hasStats(): boolean {
  const s = brand.stats as Record<string, number | null>;
  return Object.values(s).every((v) => typeof v === 'number');
}

export function whatsappNumber(): string | null {
  const n = filled(brand.whatsapp);
  return n ? n.replace(/[^\d]/g, '') : null;
}

export function configuredSocials(): { network: SocialNetwork; url: string }[] {
  return (Object.keys(brand.social) as SocialNetwork[])
    .map((network) => ({ network, url: filled(brand.social[network]) }))
    .filter((s): s is { network: SocialNetwork; url: string } => s.url !== null);
}
