/**
 * Media manifest — the ONLY file to edit when site assets change.
 * Raw renders live in media-source/; `node scripts/prepare-media.mjs` crops and optimises them into
 * public/media/…, and each slot points at its public path, e.g. heroPoster: '/media/hero/poster.jpg'.
 * `null` renders a branded shimmer placeholder with the same reserved aspect ratio.
 *
 * Portfolio project renders are not slots: see scripts/projects.manifest.mjs and src/content/projects.ts.
 */

const design360Slots = ['design360_01', 'design360_02', 'design360_03', 'design360_04', 'design360_05', 'design360_06'] as const;
const stepSlots = ['step01', 'step02', 'step03', 'step04', 'step05', 'step06', 'step07', 'step08', 'step09'] as const;
const partnerSlots = ['partner01', 'partner02', 'partner03', 'partner04', 'partner05', 'partner06', 'partner07', 'partner08'] as const;

export const mediaSlots = [
  'logoFull', 'logoMark', 'logoWhite',
  'heroPoster', 'heroVideo',
  'aboutOffice', 'aboutTeam',
  'ownerCard', 'ownerVideo', 'contractorCard', 'contractorVideo', 'supplierCard', 'consultantCard',
  ...stepSlots,
  ...design360Slots,
  'mapTexture', 'appPhone', 'appStoreBadge', 'googlePlayBadge', 'ogDefault',
  ...partnerSlots,
  'materialsIcon',
] as const;

export type MediaSlot = (typeof mediaSlots)[number];
export type Design360Slot = (typeof design360Slots)[number];
export type StepSlot = (typeof stepSlots)[number];
export type PartnerSlot = (typeof partnerSlots)[number];

export { design360Slots, stepSlots, partnerSlots };

export const media: Record<MediaSlot, string | null> = {
  logoFull: '/media/logo/logo-full.png',
  logoMark: '/media/logo/mark.png',
  logoWhite: '/media/logo/logo-white.png',
  heroPoster: '/media/hero/poster.jpg',
  heroVideo: '/media/hero/hero.mp4',
  aboutOffice: '/media/about/office.jpg',
  aboutTeam: '/media/about/team.jpg',
  ownerCard: '/media/personas/owner.jpg',
  ownerVideo: null,
  contractorCard: '/media/personas/contractor.jpg',
  contractorVideo: null,
  supplierCard: '/media/personas/supplier.jpg',
  consultantCard: '/media/personas/consultant.jpg',
  step01: '/media/steps/step-01-brief.jpg',
  step02: '/media/steps/step-02-budget.jpg',
  step03: '/media/steps/step-03-design.jpg',
  step04: '/media/steps/step-04-approvals.jpg',
  step05: '/media/steps/step-05-tender.jpg',
  step06: '/media/steps/step-06-bids.jpg',
  step07: '/media/steps/step-07-analysis.jpg',
  step08: '/media/steps/step-08-evaluation.jpg',
  step09: '/media/steps/step-09-contract.jpg',
  design360_01: '/media/360/majlis.jpg',
  design360_02: '/media/360/staircase.jpg',
  design360_03: '/media/360/bedroom.jpg',
  design360_04: '/media/360/kitchen.jpg',
  design360_05: '/media/360/courtyard.jpg',
  design360_06: '/media/360/living.jpg',
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
  heroPoster: spec('image', 2560, 1440, 'JPG/AVIF, < 400 KB'),
  heroVideo: spec('video', 1920, 1080, 'MP4 H.264, muted, 10–20 s loop, < 6 MB'),
  aboutOffice: spec('image', 1200, 1500, 'JPG'),
  aboutTeam: spec('image', 1800, 1200, 'JPG'),
  ownerCard: spec('image', 1200, 900, 'JPG'),
  ownerVideo: spec('video', 1920, 1080, 'MP4 H.264 with audio, < 25 MB'),
  contractorCard: spec('image', 1200, 900, 'JPG'),
  contractorVideo: spec('video', 1920, 1080, 'MP4 H.264 with audio, < 25 MB'),
  supplierCard: spec('image', 1200, 900, 'JPG'),
  consultantCard: spec('image', 1200, 900, 'JPG'),
  ...(Object.fromEntries(stepSlots.map((s) => [s, spec('image', 800, 800, 'JPG, subject centred (shown in a circle)')])) as Record<StepSlot, MediaSpec>),
  ...(Object.fromEntries(design360Slots.map((s) => [s, spec('image', 1774, 887, 'JPG, 2:1 panoramic render')])) as Record<Design360Slot, MediaSpec>),
  mapTexture: spec('image', 1600, 1200, 'JPG/PNG map screenshot of the office area'),
  appPhone: spec('image', 1024, 1536, 'JPG/PNG, phone render on a dark background'),
  appStoreBadge: spec('logo', 360, 120, 'Official Apple SVG badge'),
  googlePlayBadge: spec('logo', 404, 120, 'Official Google Play SVG badge'),
  ogDefault: spec('image', 1200, 630, 'JPG, used as a darkened backdrop in generated OG images'),
  ...(Object.fromEntries(partnerSlots.map((s) => [s, spec('logo', 400, 200, 'SVG/PNG, transparent, monochrome preferred')])) as Record<PartnerSlot, MediaSpec>),
  materialsIcon: spec('logo', 128, 128, 'SVG, single colour'),
};

export const isVideoSlot = (slot: MediaSlot) => mediaSpecs[slot].kind === 'video';
