// Turns the raw renders in media-source/ into web-ready, slot-sized files in public/media/.
// Each image is cropped to its slot's aspect (attention-based focus) and saved as optimised JPEG.
// Run: node scripts/prepare-media.mjs   (re-run whenever an original changes)
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const SRC = 'media-source';
const OUT = 'public/media';

/** [output path, source file, width, height] — width/height define the slot aspect (and max size). */
const jobs = [
  ['hero/poster.jpg', 'Qatari villa_ Blueprint to completion.png', 1672, 941],

  ['steps/step-01-brief.jpg', 'Elegant title deed and plot plan-1.png', 800, 800],
  ['steps/step-02-budget.jpg', 'Engineer Annotating Villa Budget Plan-2.png', 800, 800],
  ['steps/step-03-design.jpg', 'Architectural workstation with Qatari villa model-3.png', 800, 800],
  ['steps/step-04-approvals.jpg', 'Stamped approval documents in a folder-4.png', 800, 800],
  ['steps/step-05-tender.jpg', 'Qatar tender dashboard on a premium desk-5.png', 800, 800],
  ['steps/step-06-bids.jpg', 'Sealed proposals beside a tablet-6.png', 800, 800],
  ['steps/step-07-analysis.jpg', 'Contractor bid comparison chart-7.png', 800, 800],
  ['steps/step-08-evaluation.jpg', 'Qatari Villa Portfolio Review-8.png', 800, 800],
  ['steps/step-09-contract.jpg', 'Handshake over a new villa contract-9.png', 800, 800],

  ['personas/owner.jpg', 'Qatari Plot Awaiting Its Future Home.png', 1200, 900],
  ['personas/contractor.jpg', 'Blueprints and Laser Level at Dusk.png', 1200, 900],
  ['personas/supplier.jpg', 'Geometric Doha building materials yard.png', 1200, 900],
  ['personas/consultant.jpg', 'Engineers Reviewing a Qatari Villa Model.png', 1200, 900],

  ['about/office.jpg', 'Sunlit Engineering Office with Rolled Plans.png', 1200, 1500],
  ['about/team.jpg', 'Qatari Villa Portfolio Review-8.png', 1800, 1200],

  ['designs/design-01-classic-villa.jpg', 'Sunrise Arabian Villa with Mashrabiya (1).png', 1280, 1600],
  ['designs/design-02-modern-villa.jpg', 'Qatari villa_ Blueprint to completion.png', 1600, 1200],
  ['designs/design-03-majlis.jpg', 'Elegant Qatari Majlis in Warm Gold-1.png', 1600, 1600],
  ['designs/design-04-kitchen.jpg', 'Modern Qatari Villa Kitchen Panorama-4.png', 1600, 1200],
  ['designs/design-05-staircase.jpg', 'Grand Limestone Staircase in Qatari Villa-5.png', 1280, 1600],
  ['designs/design-06-living.jpg', 'Warm Contemporary Qatari Villa Interior-2.png', 1600, 1200],
  ['designs/design-07-courtyard.jpg', 'Shaded Qatari Villa Courtyard-6.png', 1600, 1600],
  ['designs/design-08-bedroom.jpg', 'Luxurious Qatari Villa Master Bedroom-3.png', 1200, 1600],

  ['360/majlis.jpg', 'Elegant Qatari Majlis in Warm Gold-1.png', 1774, 887],
  ['360/staircase.jpg', 'Grand Limestone Staircase in Qatari Villa-5.png', 1774, 887],
  ['360/bedroom.jpg', 'Luxurious Qatari Villa Master Bedroom-3.png', 1774, 887],
  ['360/kitchen.jpg', 'Modern Qatari Villa Kitchen Panorama-4.png', 1774, 887],
  ['360/courtyard.jpg', 'Shaded Qatari Villa Courtyard-6.png', 1774, 887],
  ['360/living.jpg', 'Warm Contemporary Qatari Villa Interior-2.png', 1774, 887],

  ['app/phone.jpg', 'Graphite smartphone with navy tender interface.png', 1024, 1536],
  ['misc/map-texture.jpg', 'Midnight Gold Qatar Coastline.png', 1600, 1200],
  ['misc/og-default.jpg', 'Minimalist navy villa with gold accents.png', 1200, 630],
];

for (const [out, src, w, h] of jobs) {
  const input = join(SRC, src);
  if (!existsSync(input)) {
    console.warn('missing source:', src);
    continue;
  }
  const meta = await sharp(input).metadata();
  // Never upscale: shrink the target box until it fits inside the source at the same aspect.
  const scale = Math.min(1, meta.width / w, meta.height / h);
  const tw = Math.round(w * scale);
  const th = Math.round(h * scale);
  const dest = join(OUT, out);
  mkdirSync(dirname(dest), { recursive: true });
  const info = await sharp(input)
    .resize(tw, th, { fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(dest);
  console.log(`${out.padEnd(40)} ${tw}×${th}  ${(info.size / 1024).toFixed(0)} KB`);
}

/* ── Logo ─────────────────────────────────────────────────────────────────────
 * media-source/logo.png is a square lockup: emblem (rows ~80–870) over the bilingual name.
 * Outputs: the emblem alone (square mark), the full lockup, and a version whose navy lettering
 * is lightened for dark backgrounds (gold untouched).
 */
const LOGO = join(SRC, 'logo.png');
if (existsSync(LOGO)) {
  mkdirSync(join(OUT, 'logo'), { recursive: true });
  const EMBLEM_BOTTOM = 875;

  // Emblem → trimmed → padded to a square → 512 px
  // crop first, then trim in a second pass (sharp applies trim before extract within one pipeline)
  const emblemCrop = await sharp(LOGO).extract({ left: 0, top: 0, width: 1254, height: EMBLEM_BOTTOM }).png().toBuffer();
  const emblem = await sharp(emblemCrop).trim({ threshold: 10 }).toBuffer();
  const em = await sharp(emblem).metadata();
  const side = Math.max(em.width, em.height);
  const squared = await sharp({ create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: emblem, left: Math.round((side - em.width) / 2), top: Math.round((side - em.height) / 2) }])
    .png()
    .toBuffer();
  await sharp(squared).resize(512, 512).png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 }).toFile(join(OUT, 'logo/mark.png'));

  // Full lockup, trimmed
  const full = await sharp(LOGO).trim({ threshold: 10 }).resize(720, 720, { fit: 'inside' }).png().toBuffer();
  await sharp(full).png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 }).toFile(join(OUT, 'logo/logo-full.png'));

  // Light-lettering variant: in the text band, navy pixels become sand, keeping their shading and alpha
  const { data, info } = await sharp(full).raw().toBuffer({ resolveWithObject: true });
  const textTop = Math.round(info.height * 0.66);
  for (let y = textTop; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      if (a < 10) continue;
      const navy = b > r + 12 && Math.max(r, g, b) < 170;
      const nearBlack = Math.max(r, g, b) < 45;
      if (navy || nearBlack) {
        const shade = 0.82 + 0.18 * (Math.max(r, g, b) / 170);
        data[i] = Math.round(247 * shade);
        data[i + 1] = Math.round(244 * shade);
        data[i + 2] = Math.round(238 * shade);
      }
    }
  }
  await sharp(data, { raw: info }).png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 }).toFile(join(OUT, 'logo/logo-white.png'));
  console.log('logo/mark.png, logo/logo-full.png, logo/logo-white.png');
}
