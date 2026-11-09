/**
 * Media manifest — the ONLY file to edit when site assets change.
 * Raw renders live in media-source/; `node scripts/prepare-media.mjs` crops and optimises them into
 * public/media/…, and each slot points at its public path, e.g. aboutOffice: '/media/about/office.jpg'.
 * `null` renders a branded shimmer placeholder with the same reserved aspect ratio.
 *
 * The company's project renders (home hero, persona cards, walkthrough carousel and the portfolio)
 * are not slots: see scripts/projects.manifest.mjs, src/content/projects.ts and src/content/showcase.ts.
 */

const stepSlots = ['step01', 'step02', 'step03', 'step04', 'step05', 'step06', 'step07', 'step08', 'step09'] as const;
const partnerSlots = ['partner01', 'partner02', 'partner03', 'partner04', 'partner05', 'partner06', 'partner07', 'partner08'] as const;

export const mediaSlots = [
  'logoFull', 'logoMark', 'logoWhite',
  'aboutOffice', 'aboutTeam',
  'ownerVideo', 'contractorVideo',
  ...stepSlots,
  'mapTexture', 'appPhone', 'appStoreBadge', 'googlePlayBadge', 'ogDefault',
  ...partnerSlots,
  'materialsIcon',
] as const;

export type MediaSlot = (typeof mediaSlots)[number];
export type StepSlot = (typeof stepSlots)[number];
export type PartnerSlot = (typeof partnerSlots)[number];

export { stepSlots, partnerSlots };

export const media: Record<MediaSlot, string | null> = {
  logoFull: '/media/logo/logo-full.png',
  logoMark: '/media/logo/mark.png',
  logoWhite: '/media/logo/logo-white.png',
  aboutOffice: '/media/about/office.jpg',
  aboutTeam: '/media/about/team.jpg',
  ownerVideo: null,
  contractorVideo: null,
  step01: '/media/steps/step-01-brief.jpg',
  step02: '/media/steps/step-02-budget.jpg',
  step03: '/media/steps/step-03-design.jpg',
  step04: '/media/steps/step-04-approvals.jpg',
  step05: '/media/steps/step-05-tender.jpg',
  step06: '/media/steps/step-06-bids.jpg',
  step07: '/media/steps/step-07-analysis.jpg',
  step08: '/media/steps/step-08-evaluation.jpg',
  step09: '/media/steps/step-09-contract.jpg',
  mapTexture: '/media/misc/map-texture.jpg',
  appPhone: '/media/app/phone.jpg',
  appStoreBadge: null,
  googlePlayBadge: null,
  ogDefault: '/media/misc/og-default.jpg',
  partner01: null,
  partner02: null,
  partner03: null,
  partner04: null,
  partner05: null,
  partner06: null,
  partner07: null,
  partner08: null,
  materialsIcon: null,
};

export type MediaKind = 'image' | 'video' | 'logo';

export interface MediaSpec {
  kind: MediaKind;
  /** CSS aspect-ratio, width / height */
  aspect: number;
  /** Recommended export size in pixels */
  size: string;
  format: string;
}

const spec = (kind: MediaKind, w: number, h: number, format: string): MediaSpec => ({
  kind,
  aspect: w / h,
  size: `${w}×${h}`,
  format,
});

export const mediaSpecs: Record<MediaSlot, MediaSpec> = {
  logoFull: spec('logo', 720, 665, 'PNG, transparent — full lockup, navy lettering (light backgrounds)'),
  logoMark: spec('logo', 512, 512, 'PNG, transparent — emblem only'),
  logoWhite: spec('logo', 720, 665, 'PNG, transparent — full lockup, light lettering (dark backgrounds)'),
  aboutOffice: spec('image', 1200, 1500, 'JPG'),
  aboutTeam: spec('image', 1800, 1200, 'JPG'),
  ownerVideo: spec('video', 1920, 1080, 'MP4 H.264 with audio, < 25 MB'),
  contractorVideo: spec('video', 1920, 1080, 'MP4 H.264 with audio, < 25 MB'),
  ...(Object.fromEntries(stepSlots.map((s) => [s, spec('image', 800, 800, 'JPG, subject centred (shown in a circle)')])) as Record<StepSlot, MediaSpec>),
  mapTexture: spec('image', 1600, 1200, 'JPG/PNG map screenshot of the office area'),
  appPhone: spec('image', 1024, 1536, 'JPG/PNG, phone render on a dark background'),
  appStoreBadge: spec('logo', 360, 120, 'Official Apple SVG badge'),
  googlePlayBadge: spec('logo', 404, 120, 'Official Google Play SVG badge'),
  ogDefault: spec('image', 1200, 630, 'JPG, used as a darkened backdrop in generated OG images'),
  ...(Object.fromEntries(partnerSlots.map((s) => [s, spec('logo', 400, 200, 'SVG/PNG, transparent, monochrome preferred')])) as Record<PartnerSlot, MediaSpec>),
  materialsIcon: spec('logo', 128, 128, 'SVG, single colour'),
};

export const isVideoSlot = (slot: MediaSlot) => mediaSpecs[slot].kind === 'video';
