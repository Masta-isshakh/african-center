// Turns the raw project renders in media-source/projects/<folder>/ into static, pre-sized WebP sets in
// public/media/projects/<slug>/ and writes src/content/projects.generated.ts (variant widths, blur placeholders, captions).
//
// Pipeline per image:
//   raw render → [enhance: watermark removal + 4K upscale, scripts/enhance-renders.py, cached in media-source/.enhanced/]
//              → JPEG master (long edge 3840 px, cached in media-source/.masters/)
//              → WebP variants at 480 / 768 / 1080 / 1440 / 2048 / 2560 / 3840 px (never upscaled past the master)
//                named <nn>-<key>-<hash>-<width>.webp
// Nothing is encoded at request time: next/image picks a variant through src/lib/project-image.ts, and the
// content hash in every file name lets the files be cached as immutable (see next.config.js / customHttp.yml).
// Videos are transcoded to 1080p + 720p H.264 (faststart) with an upscaled poster frame, via ffmpeg when available.
//
// Run: npm run prepare:projects [-- --force | --skip-enhance | --plan-only]
// Env: PYTHON (interpreter with scripts/requirements-enhance.txt installed); models in media-source/.models/ — see scripts/enhance-renders.py
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { projects } from './projects.manifest.mjs';

const SRC = 'media-source/projects';
const ENHANCED = 'media-source/.enhanced';
const MASTERS = 'media-source/.masters';
const OUT = 'public/media/projects';
const PUBLIC_BASE = '/media/projects';
const GENERATED = 'src/content/projects.generated.ts';
const LONG_EDGE = 3840;
const WIDTHS = [480, 768, 1080, 1440, 2048, 2560, 3840];
/** Sources whose long edge is at most this get Real-ESRGAN; larger ones are resized with Lanczos. */
const AI_UPSCALE_MAX_EDGE = 1920;
/** Bump to invalidate every hashed file name (e.g. after changing the enhancement or encoder settings). */
const PIPELINE_VERSION = 'v3';

const args = new Set(process.argv.slice(2));
const force = args.has('--force');

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const pad2 = (n) => String(n).padStart(2, '0');
const hashOf = (file) => createHash('sha1').update(readFileSync(file)).update(PIPELINE_VERSION).digest('hex').slice(0, 8);

function folderOf(needle) {
  const dir = readdirSync(SRC).find((n) => n.includes(needle));
  if (!dir) throw new Error(`No folder containing "${needle}" under ${SRC}`);
  return join(SRC, dir);
}

function sourceOf(folder, suffix) {
  const file = readdirSync(folder).find((n) => n.endsWith(suffix));
  if (!file) throw new Error(`No file ending with "${suffix}" in ${folder}`);
  return join(folder, file);
}

/** Output is up to date when it exists and is newer than its source (unless --force). */
const fresh = (dest, src) => !force && existsSync(dest) && statSync(dest).mtimeMs >= statSync(src).mtimeMs;

function hasBinary(bin) {
  try {
    execFileSync(bin, ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const isWatermarked = (project, suffix) => project.watermark === 'all' || (Array.isArray(project.watermark) && project.watermark.includes(suffix));

/** Tiny WebP (≤ 16 px) inlined as the next/image blur placeholder. */
async function blurOf(file) {
  const buf = await sharp(file).resize(16, 16, { fit: 'inside' }).webp({ quality: 25 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

/* ── 1. Enhancement plan (watermark removal + upscaling), executed by scripts/enhance-renders.py ───────── */

async function planJob(src, key, slug, nn, watermark) {
  const meta = await sharp(src, { limitInputPixels: false }).metadata();
  const longEdge = Math.max(meta.width, meta.height);
  const upscale = longEdge >= LONG_EDGE ? 'none' : longEdge <= AI_UPSCALE_MAX_EDGE ? 'ai' : 'resize';
  if (!watermark && upscale === 'none') return null;
  const targetWidth = meta.width >= meta.height ? LONG_EDGE : Math.round((LONG_EDGE * meta.width) / meta.height);
  return { key: `${slug}/${nn}-${key}`, src, out: join(ENHANCED, slug, `${nn}-${key}.jpg`), srcHash: hashOf(src), watermark, targetWidth, upscale };
}

function runEnhancer(jobs) {
  mkdirSync(ENHANCED, { recursive: true });
  const planPath = join(ENHANCED, 'plan.json');
  writeFileSync(planPath, JSON.stringify({ jobs }, null, 2));
  console.log(`\nEnhancement plan: ${jobs.length} jobs (${jobs.filter((j) => j.watermark).length} watermark removals, ${jobs.filter((j) => j.upscale === 'ai').length} AI upscales) → ${planPath}`);
  if (args.has('--plan-only')) process.exit(0);
  if (args.has('--skip-enhance')) return;
  const python = process.env.PYTHON || 'python';
  try {
    execFileSync(python, ['-I', 'scripts/enhance-renders.py', planPath, ...(force ? ['--force'] : [])], { stdio: 'inherit', env: process.env });
  } catch (err) {
    console.warn(`\nenhance-renders.py failed (${err.message.split('\n')[0]}) — continuing with whatever enhanced files exist.`);
  }
}

/* ── 2. Masters and variants ───────────────────────────────────────────────────────────────────────────── */

/** JPEG master (local cache): the enhanced render when there is one, otherwise the raw file, long edge ≤ 3840. */
async function master(src, dest) {
  if (!fresh(dest, src)) {
    await sharp(src, { limitInputPixels: false })
      .rotate()
      .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(dest);
  }
  return dest;
}

/** WebP set for one master: ladder widths below the native width, plus the native width. */
async function variants(masterFile, outDir, baseName, produced) {
  const meta = await sharp(masterFile).metadata();
  const native = Math.min(meta.width, LONG_EDGE);
  const widths = [...new Set([...WIDTHS.filter((w) => w < native), native])].sort((a, b) => a - b);
  let bytes = 0;
  for (const w of widths) {
    const name = `${baseName}-${w}.webp`;
    const dest = join(outDir, name);
    if (!fresh(dest, masterFile)) await sharp(masterFile).resize({ width: w }).webp({ quality: w >= 2560 ? 76 : 80, effort: 4 }).toFile(dest);
    produced.add(name);
    bytes += statSync(dest).size;
  }
  const largest = widths[widths.length - 1];
  return { widths, width: meta.width, height: meta.height, blur: await blurOf(join(outDir, `${baseName}-${widths[0]}.webp`)), bytes, largest };
}

function record(slug, key, baseName, v, category, en, ar) {
  const base = `${PUBLIC_BASE}/${slug}/${baseName}`;
  return { key, base, widths: v.widths, src: `${base}-${v.largest}.webp`, width: v.width, height: v.height, blur: v.blur, category, caption: { en, ar } };
}

const renditions = [
  { suffix: '1080', width: 1920, height: 1080, args: ['-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-maxrate', '4500k', '-bufsize', '9000k'] },
  { suffix: '720', width: 1280, height: 720, args: ['-vf', 'scale=1280:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-maxrate', '2200k', '-bufsize', '4400k'] },
];

/** Extracts the poster frame (lossless PNG) so it can go through the same enhancement as the stills. */
function posterFrame(src, dest, at) {
  if (fresh(dest, src)) return dest;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(at), '-i', src, '-frames:v', '1', dest]);
  return dest;
}

async function video(folder, spec, outDir, mastersDir, slug, produced, enhancedSrc) {
  const src = sourceOf(folder, spec.source);
  const hash = hashOf(src);
  const sources = [];
  for (const r of renditions) {
    const name = `walkthrough-${hash}-${r.suffix}.mp4`;
    const dest = join(outDir, name);
    if (!fresh(dest, src)) {
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, ...r.args, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', dest], { stdio: 'inherit' });
    }
    produced.add(name);
    sources.push({ src: `${PUBLIC_BASE}/${slug}/${name}`, width: r.width, height: r.height });
    console.log(`  ${name.padEnd(56)} ${kb(statSync(dest).size)}`);
  }
  const baseName = `${spec.poster.key}-${hash}`;
  const m = await master(enhancedSrc, join(mastersDir, `${spec.poster.key}.jpg`));
  const v = await variants(m, outDir, baseName, produced);
  const duration = Math.round(Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]).toString().trim()));
  console.log(`  ${baseName.padEnd(56)} ${v.width}×${v.height}  ${v.widths.join('/')}  ${kb(v.bytes)}  (${duration}s)`);
  return { sources, poster: record(slug, spec.poster.key, baseName, v, 'exterior', spec.poster.en, spec.poster.ar), duration };
}

/* ── main ──────────────────────────────────────────────────────────────────────────────────────────────── */

const ffmpeg = hasBinary('ffmpeg');

// Pass 1: resolve sources and build the enhancement plan.
const work = [];
const jobs = [];
for (const project of projects) {
  const folder = folderOf(project.folder);
  const mastersDir = join(MASTERS, project.slug);
  mkdirSync(mastersDir, { recursive: true });
  const images = [];
  for (const [i, [suffix, key, category, en, ar]] of project.images.entries()) {
    const src = sourceOf(folder, suffix);
    const job = await planJob(src, key, project.slug, pad2(i + 1), isWatermarked(project, suffix));
    if (job) jobs.push(job);
    images.push({ i, key, category, en, ar, src, job });
  }
  let videoPlan = null;
  if (project.video && ffmpeg) {
    const frame = posterFrame(sourceOf(folder, project.video.source), join(mastersDir, `${project.video.poster.key}-frame.png`), project.video.poster.at);
    const job = await planJob(frame, project.video.poster.key, project.slug, 'poster', false);
    if (job) jobs.push(job);
    videoPlan = { frame, job };
  } else if (project.video) {
    console.warn(`  ffmpeg not found — video for ${project.slug} skipped`);
  }
  work.push({ project, folder, mastersDir, images, videoPlan });
}
runEnhancer(jobs);

// Pass 2: masters, variants, cleanup, manifest.
const generated = {};
let totalBytes = 0;
let totalImages = 0;
const sourceFor = (raw, job) => (job && existsSync(job.out) ? job.out : raw);

for (const { project, folder, mastersDir, images, videoPlan } of work) {
  const outDir = join(OUT, project.slug);
  mkdirSync(outDir, { recursive: true });
  const produced = new Set();
  console.log(`\n${project.slug}  ←  ${folder}`);

  const records = [];
  for (const img of images) {
    const nn = pad2(img.i + 1);
    const input = sourceFor(img.src, img.job);
    if (img.job && input === img.src) console.warn(`  !! ${nn}-${img.key}: enhanced file missing, using the raw render`);
    const baseName = `${nn}-${img.key}-${hashOf(img.src)}`;
    const m = await master(input, join(mastersDir, `${nn}-${img.key}.jpg`));
    const v = await variants(m, outDir, baseName, produced);
    totalBytes += v.bytes;
    totalImages++;
    records.push(record(project.slug, img.key, baseName, v, img.category, img.en, img.ar));
    console.log(`  ${baseName.padEnd(56)} ${String(v.width).padStart(4)}×${v.height}  ${v.widths.join('/')}  ${kb(v.bytes)}`);
  }

  const vid = videoPlan ? await video(folder, project.video, outDir, mastersDir, project.slug, produced, sourceFor(videoPlan.frame, videoPlan.job)) : null;

  // Remove outputs from earlier runs so public/ only holds what the site references.
  for (const stale of readdirSync(outDir).filter((f) => !produced.has(f))) {
    unlinkSync(join(outDir, stale));
    console.log(`  removed stale ${stale}`);
  }

  generated[project.slug] = { images: records, video: vid };
}

const header = `// AUTO-GENERATED by scripts/prepare-projects.mjs from scripts/projects.manifest.mjs — do not edit by hand.
// Re-run \`npm run prepare:projects\` after changing the manifest or the raw renders.
import type { GeneratedProjectMedia } from './projects.types';

export const projectMedia = `;
writeFileSync(GENERATED, `${header}${JSON.stringify(generated, null, 2)} satisfies Record<string, GeneratedProjectMedia>;\n`);
console.log(`\nWrote ${GENERATED}: ${Object.keys(generated).length} projects, ${totalImages} images, ${(totalBytes / 1048576).toFixed(1)} MB of WebP variants`);
