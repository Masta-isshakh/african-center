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
