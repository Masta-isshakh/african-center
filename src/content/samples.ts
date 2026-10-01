/**
 * SAMPLE CONTENT — illustrative only: not real clients, projects or prices.
 * Rendered only when NEXT_PUBLIC_SHOW_SAMPLE_CONTENT=true (design previews).
 * Every record carries `sample: true` so it can never be mistaken for published data.
 */
import type { MaterialsBulletin } from './materials';

type Bilingual = { ar: string; en: string };

export interface Testimonial {
  sample: true;
  id: string;
  name: Bilingual;
  role: Bilingual;
  quote: Bilingual;
}

export const sampleTestimonials: Testimonial[] = [
  {
    sample: true,
    id: 't1',
    name: { ar: 'م. الكواري', en: 'M. Al-Kuwari' },
    role: { ar: 'مالك فيلا – الريان', en: 'Villa owner, Al Rayyan' },
    quote: {
      ar: 'استلمت سبعة عطاءات على فيلتي، وراجعناها معاً بنداً بنداً. لأول مرة أفهم لماذا يختلف سعر مقاول عن آخر.',
      en: 'I received seven bids for my villa and we reviewed them line by line together. For the first time I understood why one contractor costs more than another.',
    },
  },
  {
    sample: true,
    id: 't2',
    name: { ar: 'ع. المري', en: 'A. Al-Marri' },
    role: { ar: 'مالك فيلا بقرض الإسكان – أم صلال', en: 'Housing-loan villa owner, Umm Salal' },
    quote: {
      ar: 'كان قرض الإسكان معتمداً لكنني لم أعرف من أين أبدأ. تولّى المكتب التصميم والرخصة، واكتفيت بالحضور يوم فتح العطاءات.',
      en: 'My housing loan was approved but I did not know where to start. The office handled the design and the permit; I only had to attend the bid opening.',
    },
  },
  {
    sample: true,
    id: 't3',
    name: { ar: 'س. الهاجري', en: 'S. Al-Hajri' },
    role: { ar: 'مالك – الوكرة', en: 'Owner, Al Wakrah' },
    quote: {
      ar: 'صيغ العقد بوضوح: مدة التنفيذ والدفعات والغرامات. وحين تأخر المقاول في التشطيبات كان المهندس المشرف هو من يتابعه.',
      en: 'The contract was clear on duration, payments and penalties. When the contractor fell behind on finishes, the supervising engineer followed it up.',
    },
  },
  {
    sample: true,
    id: 't4',
    name: { ar: 'خ. النعيمي', en: 'K. Al-Nuaimi' },
    role: { ar: 'مالك – الخور', en: 'Owner, Al Khor' },
    quote: {
      ar: 'أكثر ما طمأنني أن جدول الكميات واحد لجميع المقاولين، فالمقارنة عادلة والفروق واضحة.',
      en: 'What reassured me most was that every contractor priced the same BOQ, so the comparison was fair and the differences were obvious.',
    },
  },
  {
    sample: true,
    id: 't5',
    name: { ar: 'ف. السليطي', en: 'F. Al-Sulaiti' },
    role: { ar: 'مقاول – الفئة الثالثة', en: 'Contractor, Grade 3' },
    quote: {
      ar: 'نستلم مخططات مكتملة وجدول كميات واضحاً، فنسعّر بدقة بدلاً من التخمين، ونعلم أن الترسية تتم وفق معايير معلنة.',
      en: 'We receive complete drawings and a clear BOQ, so we price accurately instead of guessing, and we know the award follows published criteria.',
    },
  },
  {
    sample: true,
    id: 't6',
    name: { ar: 'ن. الدوسري', en: 'N. Al-Dosari' },
    role: { ar: 'مالكة فيلا – الظعاين', en: 'Villa owner, Al Daayen' },
    quote: {
      ar: 'تابعت مراحل البناء بتقارير مصوّرة من المهندس المشرف حتى يوم تسليم المفتاح.',
      en: 'I followed every stage of construction through photo reports from the supervising engineer, right up to handover.',
    },
  },
];

export type ProjectStatus = 'design' | 'tender' | 'construction' | 'completed';
export const projectStatuses: ProjectStatus[] = ['design', 'tender', 'construction', 'completed'];

export interface SampleProject {
  sample: true;
  id: string;
  name: Bilingual;
  municipality: 'alRayyan' | 'doha' | 'alWakrah' | 'ummSalal' | 'alKhor' | 'alDaayen' | 'alShamal' | 'alShahaniya';
  area: number;
  status: ProjectStatus;
  lat: number;
  lng: number;
}

export const sampleProjects: SampleProject[] = [
  { sample: true, id: 'p1', name: { ar: 'فيلا سكنية بقرض الإسكان', en: 'Housing-loan villa' }, municipality: 'alRayyan', area: 620, status: 'construction', lat: 25.29, lng: 51.42 },
  { sample: true, id: 'p2', name: { ar: 'فيلا بطابقين وملحق', en: 'Two-storey villa with annex' }, municipality: 'doha', area: 540, status: 'tender', lat: 25.31, lng: 51.5 },
  { sample: true, id: 'p3', name: { ar: 'فيلا حديثة بمجلس خارجي', en: 'Modern villa with outdoor majlis' }, municipality: 'alWakrah', area: 700, status: 'design', lat: 25.17, lng: 51.6 },
  { sample: true, id: 'p4', name: { ar: 'ترميم وإضافة طابق', en: 'Renovation and added floor' }, municipality: 'alDaayen', area: 450, status: 'completed', lat: 25.42, lng: 51.5 },
  { sample: true, id: 'p5', name: { ar: 'فيلا بطراز كلاسيكي', en: 'Classic villa' }, municipality: 'alKhor', area: 800, status: 'tender', lat: 25.68, lng: 51.5 },
  { sample: true, id: 'p6', name: { ar: 'مبنى تجاري صغير', en: 'Small commercial building' }, municipality: 'ummSalal', area: 900, status: 'design', lat: 25.41, lng: 51.4 },
];

export const sampleMaterials: MaterialsBulletin = {
  sample: true,
  updatedAt: '2026-09-28',
  items: [
    { id: 'steel8', unit: 'ton', price: 2450, previous: 2420 },
    { id: 'steel10_40', unit: 'ton', price: 2300, previous: 2330 },
    { id: 'gabbro', unit: 'ton', price: 65, previous: 65 },
    { id: 'opc', unit: 'bag50', price: 15, previous: 14.5 },
    { id: 'src', unit: 'bag50', price: 17, previous: 17 },
    { id: 'washedSand', unit: 'ton', price: 45, previous: 47 },
    { id: 'blocks', unit: 'piece', price: 2.6, previous: 2.6 },
    { id: 'readyMix', unit: 'cubicMeter', price: 260, previous: 255 },
  ],
};
