import { media, type DesignSlot, type Design360Slot } from '@/lib/media';
import { showSampleContent } from '@/lib/utils';

export type DesignStyle = 'classic' | 'modern';
export type DesignType = 'villa' | 'commercial';

export interface Design {
  slot: DesignSlot;
  style: DesignStyle;
  type: DesignType;
  /** Built-up area in m² — fill from the drawings; `null` hides the chip */
  area: number | null;
  /** `null` hides the chip */
  bedrooms: number | null;
}

/**
 * Catalogue metadata for each render slot: style/type match the delivered image;
 * fill area/bedrooms from the drawings (`null` hides the chip).
 */
const catalogue: Design[] = [
  { slot: 'design01', style: 'classic', type: 'villa', area: null, bedrooms: null }, // mashrabiya villa exterior
  { slot: 'design02', style: 'modern', type: 'villa', area: null, bedrooms: null }, // villa: blueprint to completion
  { slot: 'design03', style: 'classic', type: 'villa', area: null, bedrooms: null }, // majlis
  { slot: 'design04', style: 'modern', type: 'villa', area: null, bedrooms: null }, // kitchen
  { slot: 'design05', style: 'classic', type: 'villa', area: null, bedrooms: null }, // limestone staircase
  { slot: 'design06', style: 'modern', type: 'villa', area: null, bedrooms: null }, // living area
  { slot: 'design07', style: 'classic', type: 'villa', area: null, bedrooms: null }, // courtyard
  { slot: 'design08', style: 'modern', type: 'villa', area: null, bedrooms: null }, // master bedroom
  { slot: 'design09', style: 'classic', type: 'commercial', area: null, bedrooms: null },
  { slot: 'design10', style: 'modern', type: 'villa', area: null, bedrooms: null },
  { slot: 'design11', style: 'classic', type: 'villa', area: null, bedrooms: null },
  { slot: 'design12', style: 'modern', type: 'commercial', area: null, bedrooms: null },
];

/** Once real renders exist, only filled slots are shown; placeholders appear only before that (or in preview mode). */
const anyFilled = catalogue.some((d) => media[d.slot]);
export const designs: Design[] = anyFilled && !showSampleContent ? catalogue.filter((d) => media[d.slot]) : catalogue;

export const designFilters = ['all', 'classic', 'modern', 'villa', 'commercial'] as const;
export type DesignFilter = (typeof designFilters)[number];

export function matchesFilter(d: Design, f: DesignFilter) {
  if (f === 'all') return true;
  return d.style === f || d.type === f;
}

export const designs360: Design360Slot[] = [
  'design360_01',
  'design360_02',
  'design360_03',
  'design360_04',
  'design360_05',
  'design360_06',
];
