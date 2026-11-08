/**
 * Project render manifest — the ONLY file to edit when project images change.
 *
 * Each project maps a raw render folder under media-source/projects/ (matched by `folder`, a
 * distinctive part of the Arabic folder name) to web-ready outputs in public/media/projects/<slug>/.
 * Images are listed in display order; the FIRST image is the project's cover and page hero.
 *
 *   [source file suffix, output key, category, caption (en), caption (ar)]
 *
 * `watermark` names the renders that carry the visualiser's credit template (badge, text and line along the
 * bottom edge): 'all', or a list of source suffixes. scripts/enhance-renders.py removes it before resizing.
 * Exact and near-duplicate renders in the source folders are intentionally left out; the PDF drawing set in
 * the Al Gharrafa folder is not used.
 */

/** @typedef {'exterior' | 'aerial' | 'outdoor' | 'interior' | 'detail'} Category */

export const projects = [
  {
    slug: 'sumaysimah-neo-classic-villa',
    folder: 'سميسمة',
    images: [
      ['(3).png', 'entrance-portal', 'exterior', 'Entrance portal with fluted pilasters at dusk', 'بوابة المدخل بالأعمدة المضلّعة عند الغروب'],
      ['(1).png', 'entrance-driveway', 'exterior', 'Main entrance and driveway at dusk', 'المدخل الرئيسي والممر عند الغروب'],
      ['(2).png', 'street-corner-evening', 'exterior', 'The villa from the street corner, evening', 'الفيلا من زاوية الشارع مساءً'],
      ['(3).jpg', 'front-facade-dusk', 'exterior', 'Front façade at dusk', 'الواجهة الأمامية عند الغروب'],
      ['(4).jpg', 'facade-boundary-wall', 'exterior', 'Front façade and boundary wall', 'الواجهة الأمامية وسور الأرض'],
      ['(2).jpg', 'street-main-gate', 'exterior', 'Street view with the main gate', 'منظر الشارع مع البوابة الرئيسية'],
      ['(9).png', 'street-corner-dusk', 'exterior', 'Street corner at dusk', 'زاوية الشارع عند الغروب'],
      ['(5).jpg', 'aerial-outdoor-majlis', 'aerial', 'Aerial view with the outdoor majlis', 'منظر جوي يُظهر المجلس الخارجي'],
      ['(10).png', 'aerial-corner-day', 'aerial', 'Aerial corner view, daylight', 'منظر جوي من الزاوية نهاراً'],
      ['(4).png', 'inner-courtyard', 'outdoor', 'Inner courtyard garden', 'حديقة الفناء الداخلي'],
      ['(5).png', 'side-garden-walkway', 'outdoor', 'Side garden walkway', 'ممر الحديقة الجانبية'],
      ['(6).png', 'shaded-terrace', 'outdoor', 'Shaded terrace seating', 'جلسة الشرفة المظللة'],
      ['(1).jpg', 'front-elevation-day', 'exterior', 'Front elevation, daylight', 'الواجهة الأمامية نهاراً'],
      ['(7).png', 'side-elevation-day', 'exterior', 'Side elevation, daylight', 'الواجهة الجانبية نهاراً'],
      ['(8).png', 'corner-view-day', 'exterior', 'Corner view, daylight', 'منظر من الزاوية نهاراً'],
    ],
  },
  {
    slug: 'al-shamal-modern-villa',
    folder: 'الشمال',
    watermark: 'all',
    images: [
      ['(1).jpg', 'front-facade-dusk', 'exterior', 'Front façade at dusk', 'الواجهة الأمامية عند الغروب'],
      ['(1).png', 'front-facade-street', 'exterior', 'Front façade from the street', 'الواجهة الأمامية من الشارع'],
      ['(4).jpg', 'front-facade-evening', 'exterior', 'Front façade, evening', 'الواجهة الأمامية مساءً'],
      ['(6).png', 'street-night', 'exterior', 'Street view at night', 'منظر الشارع ليلاً'],
      ['(2).jpg', 'entrance-driveway', 'detail', 'Entrance and driveway', 'المدخل والممر'],
      ['(3).jpg', 'pool-terrace-night', 'outdoor', 'Swimming pool and terrace at night', 'المسبح والشرفة ليلاً'],
      ['(5).png', 'pool-courtyard-living', 'outdoor', 'Pool courtyard from the living area', 'فناء المسبح من صالة المعيشة'],
      ['(2).png', 'garden-wall-seating', 'outdoor', 'Outdoor seating by the garden wall', 'جلسة خارجية بجوار جدار الحديقة'],
      ['(3).png', 'aerial-pool-courtyard', 'aerial', 'Aerial view of the pool courtyard', 'منظر جوي لفناء المسبح'],
      ['(4).png', 'aerial-entrance-parking', 'aerial', 'Aerial view of the entrance and parking', 'منظر جوي للمدخل والمواقف'],
    ],
  },
  {
    slug: 'al-wakrah-modern-villa',
    folder: 'الوكرة مودرن',
    images: [
      ['(7).png', 'front-facade-pool', 'exterior', 'Front façade with the pool forecourt', 'الواجهة الأمامية مع ساحة المسبح'],
      ['(5).png', 'corner-dusk', 'exterior', 'Corner view at dusk', 'منظر من الزاوية عند الغروب'],
      ['(9).png', 'side-facade-driveway', 'exterior', 'Side façade and driveway at dusk', 'الواجهة الجانبية والممر عند الغروب'],
      ['(2).png', 'street-dusk', 'exterior', 'Street view at dusk', 'منظر الشارع عند الغروب'],
      ['(12).png', 'street-evening', 'exterior', 'The villa from the street, evening', 'الفيلا من الشارع مساءً'],
      ['(6).png', 'entrance-walkway-pool', 'outdoor', 'Entrance walkway beside the pool', 'ممر المدخل بمحاذاة المسبح'],
      ['(4).png', 'pool-terrace-night', 'outdoor', 'Pool terrace at night', 'شرفة المسبح ليلاً'],
      ['(11).png', 'pool-courtyard-night', 'outdoor', 'Pool courtyard at night', 'فناء المسبح ليلاً'],
      ['(1).png', 'aerial-roof-terrace', 'aerial', 'Aerial view of the roof terrace and pool', 'منظر جوي لشرفة السطح والمسبح'],
      ['(14).png', 'aerial-plot-pool', 'aerial', 'Aerial view of the plot and pool', 'منظر جوي للأرض والمسبح'],
    ],
  },
  {
    slug: 'rawdat-al-jahhaniya-modern-villa',
    folder: 'الجهانية',
    watermark: ['(1).jpg', '(2).jpg', '(3).jpg', '(4).jpg'],
    images: [
      ['(2).png', 'facade-screen-day', 'exterior', 'Front façade with the laser-cut screen, daylight', 'الواجهة الأمامية مع الشاشة المقطوعة بالليزر نهاراً'],
      ['(11).png', 'street-night', 'exterior', 'Street view at night', 'منظر الشارع ليلاً'],
      ['(12).png', 'facade-parking-night', 'exterior', 'Front façade and parking at night', 'الواجهة الأمامية والمواقف ليلاً'],
      ['(7).png', 'facade-night', 'exterior', 'Front façade at night', 'الواجهة الأمامية ليلاً'],
      ['(2).jpg', 'canopy-day', 'exterior', 'Entrance canopy, daylight', 'مظلة المدخل نهاراً'],
      ['(4).jpg', 'canopy-driveway', 'exterior', 'Entrance canopy from the driveway', 'مظلة المدخل من الممر'],
      ['(5).png', 'canopy-lighting', 'detail', 'Entrance canopy with integrated lighting', 'مظلة المدخل بالإضاءة المدمجة'],
      ['(6).png', 'arrival-court', 'detail', 'Arrival court', 'ساحة الوصول'],
      ['(1).png', 'entrance-screen', 'detail', 'Main entrance with the perforated screen', 'المدخل الرئيسي مع الشاشة المثقّبة'],
      ['(8).png', 'screen-night', 'detail', 'Perforated screen lit at night', 'الشاشة المثقّبة مضاءة ليلاً'],
      ['(9).png', 'entrance-night', 'detail', 'Main entrance at night', 'المدخل الرئيسي ليلاً'],
      ['(14).png', 'entrance-portal-night', 'detail', 'Entrance portal at night', 'بوابة المدخل ليلاً'],
      ['(1).jpg', 'covered-parking-side', 'exterior', 'Covered parking and side entrance', 'الموقف المغطى والمدخل الجانبي'],
      ['(3).jpg', 'covered-parking-court', 'exterior', 'Covered parking court', 'ساحة المواقف المغطاة'],
    ],
  },
  {
    slug: 'al-gharrafa-modern-villa',
    folder: 'الغرافة',
    images: [
      ['(1).jpg', 'front-facade-dusk', 'exterior', 'Front façade at dusk', 'الواجهة الأمامية عند الغروب'],
      ['(3).jpg', 'front-facade-day', 'exterior', 'Front façade, daylight', 'الواجهة الأمامية نهاراً'],
      ['(4).jpg', 'facade-driveway', 'exterior', 'Front façade from the driveway', 'الواجهة الأمامية من الممر'],
      ['(5).jpg', 'corner-dusk', 'exterior', 'Corner view at dusk', 'منظر من الزاوية عند الغروب'],
    ],
    video: {
      source: '(1).mp4',
      poster: { at: 30.5, key: 'walkthrough-poster', en: 'Walkthrough video — the villa from the street at dusk', ar: 'فيديو الجولة — الفيلا من الشارع عند الغروب' },
    },
  },
  {
    slug: 'al-wukair-neo-classic-villa',
    folder: 'الوكير',
    watermark: 'all',
    images: [
      ['(1).jpg', 'facade-garden-dusk', 'exterior', 'Front façade and garden at dusk', 'الواجهة الأمامية والحديقة عند الغروب'],
      ['(8).jpg', 'front-elevation-symmetrical', 'exterior', 'Symmetrical front elevation', 'الواجهة الأمامية المتناظرة'],
      ['(7).jpg', 'front-elevation-boundary-wall', 'exterior', 'Front elevation with the boundary wall', 'الواجهة الأمامية مع سور الأرض'],
      ['(6).jpg', 'street-elevation-dusk', 'exterior', 'Street elevation at dusk', 'واجهة الشارع عند الغروب'],
      ['(2).jpg', 'entrance-facade-pilasters', 'exterior', 'Entrance façade with illuminated pilasters', 'واجهة المدخل بالأعمدة المضاءة'],
      ['(3).jpg', 'driveway-entrance-dusk', 'exterior', 'Driveway and entrance at dusk', 'الممر والمدخل عند الغروب'],
      ['(5).jpg', 'facade-forecourt', 'exterior', 'Front façade from the forecourt', 'الواجهة الأمامية من الساحة الأمامية'],
      ['(4).jpg', 'entrance-chandelier', 'detail', 'Double-height entrance with chandelier', 'المدخل بارتفاع طابقين مع الثريا'],
      ['(11).jpg', 'main-gate-night', 'detail', 'Main gate at night', 'البوابة الرئيسية ليلاً'],
      ['(9).jpg', 'pedestrian-gate', 'detail', 'Pedestrian gate and boundary wall', 'بوابة المشاة وسور الأرض'],
      ['(10).jpg', 'boundary-wall-detail', 'detail', 'Boundary wall detail at dusk', 'تفصيل سور الأرض عند الغروب'],
    ],
  },
  {
    slug: 'al-wakrah-classic-villa',
    folder: 'كلا سيك الوكرة',
    images: [
      ['(2).jpg', 'entrance-facade-columns', 'exterior', 'Entrance façade with classical columns', 'واجهة المدخل بالأعمدة الكلاسيكية'],
      ['(1).jpg', 'front-elevation', 'exterior', 'Front elevation', 'الواجهة الأمامية'],
      ['(3).jpg', 'corner-street', 'exterior', 'Corner view from the street', 'منظر من زاوية الشارع'],
      ['(4).jpg', 'street-boundary-wall', 'exterior', 'Street view with the boundary wall', 'منظر الشارع مع سور الأرض'],
    ],
  },
  {
    slug: 'al-shahaniya-majlis',
    folder: 'مجلس الشيحانية',
    images: [
      ['(6).png', 'facade-arched-entrance', 'exterior', 'Exterior façade with the arched entrance', 'الواجهة الخارجية مع المدخل المقوّس'],
      ['(3).jpg', 'perspective-entrance-arch', 'exterior', 'Exterior perspective, entrance arch', 'منظور خارجي يُبرز قوس المدخل'],
      ['(4).jpg', 'perspective-arched-windows', 'exterior', 'Exterior perspective, arched windows', 'منظور خارجي للنوافذ المقوّسة'],
      ['(6).jpg', 'perspective-morning', 'exterior', 'Exterior perspective, morning light', 'منظور خارجي في ضوء الصباح'],
      ['(7).jpg', 'perspective-street', 'exterior', 'Exterior perspective from the street', 'منظور خارجي من الشارع'],
      ['(8).jpg', 'perspective-colonnade', 'exterior', 'Exterior perspective, colonnade', 'منظور خارجي يُظهر صف الأعمدة'],
      ['(1).jpg', 'front-elevation-study', 'exterior', 'Front elevation study', 'دراسة الواجهة الأمامية'],
      ['(1).png', 'majlis-guests', 'interior', 'Majlis interior with guests', 'داخل المجلس مع الضيوف'],
      ['(8).png', 'majlis-timber-mashrabiya', 'interior', 'Majlis interior, timber and mashrabiya ceiling', 'داخل المجلس بالخشب وسقف المشربية'],
      ['(3).png', 'majlis-seating', 'interior', 'Majlis seating area', 'منطقة جلوس المجلس'],
      ['(7).png', 'majlis-media-wall', 'interior', 'Majlis with media wall', 'المجلس مع جدار الشاشة'],
      ['(4).png', 'classic-majlis-chandelier', 'interior', 'Classic majlis with chandelier', 'مجلس كلاسيكي مع ثريا'],
      ['(5).png', 'classic-majlis-seating', 'interior', 'Classic majlis seating', 'جلسات المجلس الكلاسيكي'],
    ],
  },
  {
    slug: 'al-shahaniya-neo-classic-villa',
    folder: 'نيو كلاسيك الشيحانية',
    watermark: ['(1).jpg', '(3).jpg', '(4).jpg', '(5).jpg'],
    images: [
      ['(1).jpg', 'front-facade-dusk', 'exterior', 'Front façade at dusk', 'الواجهة الأمامية عند الغروب'],
      ['(5).jpg', 'street-dusk', 'exterior', 'Street view at dusk', 'منظر الشارع عند الغروب'],
      ['(1).png', 'aerial-dusk', 'aerial', 'Aerial view at dusk', 'منظر جوي عند الغروب'],
      ['(2).png', 'entrance-planting', 'detail', 'Entrance planting and façade lighting', 'زراعة المدخل وإضاءة الواجهة'],
      ['(3).jpg', 'facade-low-angle', 'detail', 'Façade detail, low angle', 'تفصيل الواجهة من زاوية منخفضة'],
      ['(4).jpg', 'pilasters-glazing', 'detail', 'Pilasters and glazing, low angle', 'الأعمدة والزجاج من زاوية منخفضة'],
    ],
  },
];
