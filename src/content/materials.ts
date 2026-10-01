import { showSampleContent } from '@/lib/utils';
import { sampleMaterials } from './samples';

export const materialIds = [
  'steel8',
  'steel10_40',
  'gabbro',
  'opc',
  'src',
  'washedSand',
  'blocks',
  'readyMix',
] as const;
export type MaterialId = (typeof materialIds)[number];

export type MaterialUnit = 'ton' | 'bag50' | 'cubicMeter' | 'piece';

export interface MaterialPrice {
  id: MaterialId;
  unit: MaterialUnit;
  /** QAR per unit; `null` until ACEC publishes its first bulletin */
  price: number | null;
  /** Price in the previous bulletin, for the change arrow */
  previous: number | null;
}

export interface MaterialsBulletin {
  /** ISO date of the bulletin; drives the "live" pulse (≤ 7 days old) */
  updatedAt: string | null;
  items: MaterialPrice[];
  sample?: boolean;
}

const units: Record<MaterialId, MaterialUnit> = {
  steel8: 'ton',
  steel10_40: 'ton',
  gabbro: 'ton',
  opc: 'bag50',
  src: 'bag50',
  washedSand: 'ton',
  blocks: 'piece',
  readyMix: 'cubicMeter',
};

/** Published bulletin. Fill `updatedAt` and each `price`/`previous` from ACEC's market survey. */
const published: MaterialsBulletin = {
  updatedAt: null,
  items: materialIds.map((id) => ({ id, unit: units[id], price: null, previous: null })),
};

export const materials: MaterialsBulletin = showSampleContent ? sampleMaterials : published;

/** Six items shown in the floating side panel */
export const panelMaterialIds: MaterialId[] = ['steel8', 'steel10_40', 'gabbro', 'opc', 'src', 'washedSand'];
/** Three tiles on the home page */
export const teaserMaterialIds: MaterialId[] = ['steel10_40', 'opc', 'gabbro'];

export const hasPrices = (b: MaterialsBulletin) => b.items.some((i) => i.price !== null);

export const pickMaterials = (b: MaterialsBulletin, ids: MaterialId[]) =>
  ids.map((id) => b.items.find((i) => i.id === id)).filter((i): i is MaterialPrice => Boolean(i));

export function changeOf(item: MaterialPrice): 'up' | 'down' | 'flat' | null {
  if (item.price === null || item.previous === null) return null;
  if (item.price > item.previous) return 'up';
  if (item.price < item.previous) return 'down';
  return 'flat';
}
