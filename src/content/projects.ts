/**
 * Design portfolio — the villa and majlis projects shown under /designs.
 * Metadata lives here; images, drawings and video come from projects.generated.ts, which
 * `npm run prepare:projects` writes from scripts/projects.manifest.mjs (the first manifest image is the cover).
 */
import { projectMedia } from './projects.generated';
import {
  projectFilters,
  projectStyles,
  type Bilingual,
  type GalleryImage,
  type GeneratedProjectMedia,
  type ProjectCardData,
  type ProjectFeature,
  type ProjectFilter,
  type ProjectImage,
  type ProjectStyle,
  type ProjectType,
  type ProjectVideoAsset,
} from './projects.types';
import type { Locale } from '@/i18n/routing';

export { projectFilters, projectStyles };
export type { GalleryImage, ProjectCardData, ProjectFeature, ProjectFilter, ProjectImage, ProjectStyle, ProjectType, ProjectVideoAsset };

export type AreaId = 'sumaysimah' | 'alShamal' | 'alWakrah' | 'rawdatAlJahhaniya' | 'alGharrafa' | 'alWukair' | 'alShahaniya';

export interface Area {
  id: AreaId;
  name: Bilingual;
  /** Approximate centre, for the stylised map only */
  lat: number;
  lng: number;
  labelSide: 'start' | 'end';
  /** Vertical label nudge (SVG px) where two areas sit close together */
  labelDy?: number;
}

export const areas: Record<AreaId, Area> = {
  sumaysimah: { id: 'sumaysimah', name: { en: 'Sumaysimah', ar: 'سميسمة' }, lat: 25.575, lng: 51.485, labelSide: 'start' },
  alShamal: { id: 'alShamal', name: { en: 'Al Shamal', ar: 'الشمال' }, lat: 26.13, lng: 51.21, labelSide: 'end' },
  alWakrah: { id: 'alWakrah', name: { en: 'Al Wakrah', ar: 'الوكرة' }, lat: 25.17, lng: 51.6, labelSide: 'start', labelDy: -8 },
  rawdatAlJahhaniya: { id: 'rawdatAlJahhaniya', name: { en: 'Rawdat Al Jahhaniya', ar: 'روضة الجهانية' }, lat: 25.265, lng: 51.235, labelSide: 'start' },
  alGharrafa: { id: 'alGharrafa', name: { en: 'Al Gharrafa', ar: 'الغرافة' }, lat: 25.33, lng: 51.43, labelSide: 'end' },
  alWukair: { id: 'alWukair', name: { en: 'Al Wukair', ar: 'الوكير' }, lat: 25.15, lng: 51.535, labelSide: 'start', labelDy: 12 },
  alShahaniya: { id: 'alShahaniya', name: { en: 'Al Shahaniya', ar: 'الشيحانية' }, lat: 25.37, lng: 51.22, labelSide: 'start' },
};

interface ProjectMeta {
  slug: string;
  style: ProjectStyle;
  type: ProjectType;
  /** Shown in the home-page section (first six) */
  featured: boolean;
  area: AreaId;
  title: Bilingual;
  /** One line, ≤ 160 characters — meta description and card hover */
  excerpt: Bilingual;
  /** Two or three sentences for the project page */
  summary: Bilingual;
  features: ProjectFeature[];
}

/** Curated order for the /designs grid: strongest exteriors first, then the smaller sets. */
const catalogue: ProjectMeta[] = [
  {
    slug: 'sumaysimah-neo-classic-villa',
    style: 'neoClassic',
    type: 'villa',
    featured: true,
    area: 'sumaysimah',
    title: { en: 'Neo-classic villa in Sumaysimah', ar: 'فيلا نيو كلاسيك في سميسمة' },
    excerpt: {
      en: 'Neo-classic villa in Sumaysimah over ground, first and roof floors with an outdoor majlis — entrance portal, courtyard and terrace renders.',
      ar: 'فيلا نيو كلاسيك في سميسمة من طابق أرضي وأول وطابق سطح مع مجلس خارجي — مشاهد المدخل والفناء والشرفة.',
    },
    summary: {
      en: 'A family villa over ground, first and roof floors with a detached outdoor majlis, drawn in a restrained neo-classic language: fluted pilasters, a double-height entrance portal and deep cornices in light stone. Warm façade lighting, a planted inner courtyard and a shaded side terrace give the house its evening character.',
      ar: 'فيلا عائلية من طابق أرضي وأول وطابق سطح مع مجلس خارجي منفصل، صُمّمت بلغة نيو كلاسيك هادئة: أعمدة مضلّعة وبوابة مدخل بارتفاع طابقين وكرانيش عميقة بالحجر الفاتح. وتمنح إضاءة الواجهات الدافئة والفناء الداخلي المزروع والشرفة الجانبية المظللة البيت طابعه المسائي.',
    },
    features: ['ground', 'first', 'roof', 'outdoorMajlis'],
  },
  {
    slug: 'rawdat-al-jahhaniya-modern-villa',
    style: 'modern',
    type: 'villa',
    featured: true,
    area: 'rawdatAlJahhaniya',
    title: { en: 'Modern villa in Rawdat Al Jahhaniya', ar: 'فيلا حديثة في روضة الجهانية' },
    excerpt: {
      en: 'Modern villa in Rawdat Al Jahhaniya with a laser-cut entrance screen and an outdoor majlis — day and night renders.',
      ar: 'فيلا حديثة في روضة الجهانية بشاشة مدخل مقطوعة بالليزر ومجلس خارجي — مشاهد نهارية وليلية.',
    },
    summary: {
      en: 'A modern villa over ground, first and roof floors with an outdoor majlis. Travertine-toned walls wrap a laser-cut screen that filters light into the entrance, a cantilevered canopy with a continuous light line marks the arrival court, and the covered parking sits discreetly to one side.',
      ar: 'فيلا حديثة من طابق أرضي وأول وطابق سطح مع مجلس خارجي. تلتف جدران بلون الترافرتين حول شاشة مقطوعة بالليزر تُرشّح الضوء إلى المدخل، وتحدّد مظلة بارزة بخط إضاءة متصل ساحة الوصول، بينما يقع الموقف المغطى جانباً بهدوء.',
    },
    features: ['ground', 'first', 'roof', 'outdoorMajlis'],
  },
  {
    slug: 'al-shamal-modern-villa',
    style: 'modern',
    type: 'villa',
    featured: true,
    area: 'alShamal',
    title: { en: 'Modern villa in Al Shamal', ar: 'فيلا حديثة في الشمال' },
    excerpt: {
      en: 'Modern villa in Al Shamal with a majlis, driver’s room and pool courtyard — façade, pool and aerial renders.',
      ar: 'فيلا حديثة في الشمال مع مجلس وغرفة سائق وفناء مسبح — مشاهد الواجهات والمسبح والمشاهد الجوية.',
    },
    summary: {
      en: 'A contemporary villa on ground, first and roof floors with a majlis and a driver’s room. Stacked stone volumes are cut by tall glazing and a perforated screen over the entrance, while the pool courtyard and garden-wall seating turn the rear of the plot into an outdoor living room.',
      ar: 'فيلا معاصرة من طابق أرضي وأول وطابق سطح مع مجلس وغرفة سائق. كتل حجرية متراكبة تقطعها واجهات زجاجية عالية وشاشة مثقّبة فوق المدخل، فيما يحوّل فناء المسبح وجلسة جدار الحديقة الجزء الخلفي من الأرض إلى صالة معيشة خارجية.',
    },
    features: ['ground', 'first', 'roof', 'majlis', 'driverRoom', 'pool'],
  },
  {
    slug: 'al-wukair-neo-classic-villa',
    style: 'neoClassic',
    type: 'villa',
    featured: true,
    area: 'alWukair',
    title: { en: 'Neo-classic villa in Al Wukair', ar: 'فيلا نيو كلاسيك في الوكير' },
    excerpt: {
      en: 'Neo-classic villa in Al Wukair with illuminated pilasters and a double-height entrance — façade and gate renders.',
      ar: 'فيلا نيو كلاسيك في الوكير بأعمدة مضاءة ومدخل بارتفاع طابقين — مشاهد الواجهات والبوابات.',
    },
    summary: {
      en: 'A neo-classic villa on ground, first and roof floors with a driver’s room. Slender illuminated pilasters rise the full height of the façade, a double-height glazed entrance reveals the chandelier within, and the boundary wall carries the same stone and timber detailing.',
      ar: 'فيلا نيو كلاسيك من طابق أرضي وأول وطابق سطح مع غرفة سائق. ترتفع أعمدة نحيلة مضاءة بكامل ارتفاع الواجهة، ويكشف مدخل زجاجي بارتفاع طابقين عن الثريا في الداخل، ويحمل سور الأرض تفاصيل الحجر والخشب نفسها.',
    },
    features: ['ground', 'first', 'roof', 'driverRoom'],
  },
  {
    slug: 'al-wakrah-modern-villa',
    style: 'modern',
    type: 'villa',
    featured: true,
    area: 'alWakrah',
    title: { en: 'Modern villa in Al Wakrah', ar: 'فيلا مودرن في الوكرة' },
    excerpt: {
      en: 'Modern villa in Al Wakrah with a pool forecourt and roof terrace — street, pool and aerial renders.',
      ar: 'فيلا مودرن في الوكرة بساحة مسبح أمامية وشرفة سطح — مشاهد الشارع والمسبح والمشاهد الجوية.',
    },
    summary: {
      en: 'A modern villa composed of crisp white volumes framed by vertical fins and warm back-lit slots. The pool forecourt reflects the façade from the street, the entrance walkway runs beside the water, and a roof terrace extends the living space upward.',
      ar: 'فيلا مودرن من كتل بيضاء حادّة تؤطّرها زعانف رأسية وشقوق مضاءة بدفء. تعكس ساحة المسبح الأمامية الواجهة من الشارع، ويمتد ممر المدخل بمحاذاة الماء، فيما تضيف شرفة السطح مساحة معيشة إضافية.',
    },
    features: ['ground', 'first', 'roof', 'pool'],
  },
  {
    slug: 'al-shahaniya-neo-classic-villa',
    style: 'neoClassic',
    type: 'villa',
    featured: true,
    area: 'alShahaniya',
    title: { en: 'Neo-classic villa in Al Shahaniya', ar: 'فيلا نيو كلاسيك في الشيحانية' },
    excerpt: {
      en: 'Neo-classic villa in Al Shahaniya with an outdoor majlis and external annex — façade, aerial and detail renders.',
      ar: 'فيلا نيو كلاسيك في الشيحانية مع مجلس خارجي وملحق خارجي — مشاهد الواجهات والمشاهد الجوية والتفاصيل.',
    },
    summary: {
      en: 'A neo-classic villa over ground, first and roof floors with an outdoor majlis and an external annex. Tall pilasters frame the glazed bays, the entrance is set in a lit stone surround with layered planting, and the aerial view shows how the main house, majlis and annex share one landscaped plot.',
      ar: 'فيلا نيو كلاسيك من طابق أرضي وأول وطابق سطح مع مجلس خارجي وملحق خارجي. تؤطّر الأعمدة العالية الفتحات الزجاجية، ويقع المدخل ضمن إطار حجري مضاء تحيط به طبقات من الزراعة، ويُظهر المنظر الجوي كيف يتشارك البيت الرئيسي والمجلس والملحق أرضاً واحدة منسّقة.',
    },
    features: ['ground', 'first', 'roof', 'outdoorMajlis', 'annex'],
  },
  {
    slug: 'al-gharrafa-modern-villa',
    style: 'modern',
    type: 'villa',
    featured: false,
    area: 'alGharrafa',
    title: { en: 'Modern villa in Al Gharrafa', ar: 'فيلا حديثة في الغرافة' },
    excerpt: {
      en: 'Two-storey modern villa in Al Gharrafa — façade renders and a short walkthrough video from the street.',
      ar: 'فيلا حديثة من طابقين في الغرافة — مشاهد الواجهات وفيديو جولة قصير من الشارع.',
    },
    summary: {
      en: 'A two-storey modern villa whose sand-coloured stone is framed by dark vertical bands and warm light lines. Tall windows, a recessed entrance and a planted boundary wall give the street front a calm, layered rhythm. A short walkthrough video shows the villa from the road at dusk.',
      ar: 'فيلا حديثة من طابقين يؤطّر حجرها الرملي أشرطةٌ رأسية داكنة وخطوط إضاءة دافئة. تمنح النوافذ العالية والمدخل الغائر والسور المزروع واجهة الشارع إيقاعاً هادئاً متدرّجاً. ويعرض فيديو قصير الفيلا من الطريق عند الغروب.',
    },
    features: ['ground', 'first'],
  },
  {
    slug: 'al-wakrah-classic-villa',
    style: 'classic',
    type: 'villa',
    featured: false,
    area: 'alWakrah',
    title: { en: 'Classic villa in Al Wakrah', ar: 'فيلا كلاسيكية في الوكرة' },
    excerpt: {
      en: 'Classic villa in Al Wakrah over ground and first floors with a penthouse — paired columns and a symmetrical entrance.',
      ar: 'فيلا كلاسيكية في الوكرة من طابق أرضي وأول مع بنتهاوس — أعمدة مزدوجة ومدخل متناظر.',
    },
    summary: {
      en: 'A classic villa over ground and first floors with a penthouse. Paired columns, moulded cornices and a symmetrical entrance set the tone, with the boundary wall and gatehouses detailed in the same cream stone.',
      ar: 'فيلا كلاسيكية من طابق أرضي وأول مع بنتهاوس. تحدّد الأعمدة المزدوجة والكرانيش البارزة والمدخل المتناظر طابعها، مع سور وبوابات بتفاصيل الحجر الكريمي نفسه.',
    },
    features: ['ground', 'first', 'penthouse'],
  },
  {
    slug: 'al-shahaniya-majlis',
    style: 'classic',
    type: 'majlis',
    featured: false,
    area: 'alShahaniya',
    title: { en: 'Majlis in Al Shahaniya', ar: 'مجلس الشيحانية' },
    excerpt: {
      en: 'Stand-alone majlis in Al Shahaniya with a pointed-arch portal — exterior perspectives and two interior schemes.',
      ar: 'مجلس مستقل في الشيحانية ببوابة بقوس مدبب — منظورات خارجية وخياران داخليان.',
    },
    summary: {
      en: 'A stand-alone majlis in Al Shahaniya, designed with a pointed-arch portal, colonnades and arched windows in white stone. Inside, two schemes were studied: a dark-timber majlis with a carved mashrabiya ceiling, and a lighter classic hall with a chandelier and continuous seating.',
      ar: 'مجلس مستقل في الشيحانية بتصميم يقوم على بوابة بقوس مدبب وصفوف أعمدة ونوافذ مقوسة بالحجر الأبيض. وفي الداخل دُرس خياران: مجلس بالخشب الداكن وسقف مشربية منقوش، وقاعة كلاسيكية أفتح بثريا وجلسات متصلة.',
    },
    features: [],
  },
];

export interface Project extends ProjectMeta {
  images: ProjectImage[];
  /** First manifest image — card cover and page hero */
  cover: ProjectImage;
  video: ProjectVideoAsset | null;
}

const generated = projectMedia as Record<string, GeneratedProjectMedia>;

export const projects: Project[] = catalogue.map((meta) => {
  const media = generated[meta.slug];
  if (!media?.images.length) throw new Error(`No generated media for project "${meta.slug}" — run \`npm run prepare:projects\``);
  return { ...meta, images: media.images, cover: media.images[0], video: media.video };
});

export const projectSlugs = projects.map((p) => p.slug);
export const featuredProjects = projects.filter((p) => p.featured).slice(0, 6);

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

export function matchesProjectFilter(p: Project, f: ProjectFilter) {
  return f === 'all' || p.style === f;
}

/** Previous/next in catalogue order, wrapping at the ends. */
export function adjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}

/** Areas that have at least one project, with counts — drives the map on /designs. */
export const portfolioAreas = (Object.keys(areas) as AreaId[])
  .map((id) => ({ ...areas[id], count: projects.filter((p) => p.area === id).length }))
  .filter((a) => a.count > 0);

export const portfolioStats = {
  projects: projects.length,
  views: projects.reduce((n, p) => n + p.images.length, 0),
  areas: portfolioAreas.length,
};

/** Localised, serialisable subset for cards — what server components hand to the client grid. */
export function toCardData(p: Project, locale: Locale): ProjectCardData {
  return {
    slug: p.slug,
    title: p.title[locale],
    location: areas[p.area].name[locale],
    excerpt: p.excerpt[locale],
    style: p.style,
    type: p.type,
    features: p.features,
    cover: { base: p.cover.base, widths: p.cover.widths, src: p.cover.src, alt: p.cover.caption[locale], blur: p.cover.blur, width: p.cover.width, height: p.cover.height },
    imageCount: p.images.length,
    hasVideo: p.video !== null,
  };
}

/** Resolves captions for the current locale (gallery, lightbox and video poster). */
export const toGalleryImages = (images: ProjectImage[], locale: Locale): GalleryImage[] =>
  images.map(({ caption, ...image }) => ({ ...image, alt: caption[locale] }));
