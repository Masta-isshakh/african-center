"""Watermark removal and 4K upscaling for the raw project renders (CPU PyTorch, no GPU needed).

scripts/prepare-projects.mjs writes a plan (media-source/.enhanced/plan.json) listing every manifest image with
what it needs; this script processes the plan and writes enhanced JPEGs (quality 95, 4:4:4) that the Node
pipeline then turns into the WebP sets. Outputs are cached: a job is skipped when its output and sidecar match.

Per image:
  1. watermark removal — the renderer's credit template (round badge bottom-left, credit text bottom-right,
     a white line with a thin gold line above it) sits at a different height in every batch, so each image is
     anchored on its white line (the only rows where ~100 % of pixels are brighter than their surroundings).
     Inside boxes placed relative to that line, a white top-hat transform (luminance minus its morphological
     opening) isolates the overlay's thin bright strokes — letters, ring, icon bars, caption — while ignoring
     broad scene highlights, so only the overlay is masked. The bottom band is then inpainted with LaMa;
     pixels outside the mask are untouched.
  2. upscaling — Real-ESRGAN x4plus (tiled) for sources that need ≥ 2× enlargement, Lanczos otherwise,
     then an exact resize to the target width (3840 px long edge).

Setup:  pip install -r scripts/requirements-enhance.txt
Models: media-source/.models/RealESRGAN_x4plus.pth and big-lama.pt (Real-ESRGAN and simple-lama-inpainting GitHub
        releases), or ESRGAN_MODEL / LAMA_MODEL env vars / --esrgan --lama flags
Usage:  python scripts/enhance-renders.py media-source/.enhanced/plan.json [--esrgan PATH] [--lama PATH] [--only KEY] [--force]
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

import cv2
import numpy as np
import torch
from PIL import Image

torch.set_num_threads(max(1, os.cpu_count() or 1))
torch.set_grad_enabled(False)

# ───────────────────────────── loading / saving ─────────────────────────────

def load_rgb(path: Path) -> np.ndarray:
    img = Image.open(path)
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        img = img.convert('RGBA')
        bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
        img = Image.alpha_composite(bg, img)
    return np.asarray(img.convert('RGB'))


def save_jpeg(path: Path, rgb: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgb).save(path, 'JPEG', quality=95, subsampling=0, optimize=True)


def luminance(rgb: np.ndarray) -> np.ndarray:
    return (0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]).astype(np.float32)


# ───────────────────────────── watermark geometry ─────────────────────────────

def line_center(lum: np.ndarray) -> int | None:
    """Centre row of the white line: consecutive rows in the bottom 20 % where ≈ every pixel beats its context."""
    h, w = lum.shape
    rows = []
    for y in range(int(h * 0.80), h - 2):
        ctx = np.concatenate([lum[max(0, y - 14):max(0, y - 3)], lum[min(h, y + 4):min(h, y + 15)]], axis=0)
        if len(ctx) == 0:
            continue
        d = lum[y] - np.median(ctx, axis=0)
        if float((d > 12).mean()) >= 0.97 and float(d.mean()) > 60:
            rows.append(y)
    if not rows:
        return None
    groups, cur = [], [rows[0]]
    for y in rows[1:]:
        if y - cur[-1] <= 2:
            cur.append(y)
        else:
            groups.append(cur)
            cur = [y]
    groups.append(cur)
    best = max(groups, key=len)
    return int(round(sum(best) / len(best)))


def badge_disc(rgb: np.ndarray, line: int) -> tuple[int, int, int]:
    """Centre and radius of the round badge: Hough circle inside the badge box, validated against the
    template's known geometry (radius ≈ 0.037 W, centre ≈ 0.062 W from the left and 0.039 W above the line),
    falling back to that geometry when detection is off."""
    h, w, _ = rgb.shape
    x0, y0 = 0, max(0, line - round(0.115 * w))
    x1, y1 = round(0.14 * w), min(h, line + round(0.025 * w))
    gray = cv2.cvtColor(rgb[y0:y1, x0:x1], cv2.COLOR_RGB2GRAY)
    blur = cv2.GaussianBlur(gray, (0, 0), max(1.0, w / 1500))
    for p2 in (40, 30, 22, 16):
        circles = cv2.HoughCircles(blur, cv2.HOUGH_GRADIENT, dp=1.2, minDist=w, param1=90, param2=p2, minRadius=int(0.030 * w), maxRadius=int(0.046 * w))
        if circles is None:
            continue
        cx, cy, r = (float(v) for v in circles[0][0])
        cx, cy = cx + x0, cy + y0
        if 0.04 * w <= cx <= 0.085 * w and 0.028 * w <= line - cy <= 0.052 * w:
            return round(cx), round(cy), round(r)
    return round(0.062 * w), round(line - 0.039 * w), round(0.040 * w)


def watermark_mask(rgb: np.ndarray) -> tuple[np.ndarray | None, dict]:
    """Binary mask (255 = inpaint) covering badge, credit text, gold line and white line; None if no line found."""
    h, w, _ = rgb.shape
    lum = luminance(rgb)
    c = line_center(lum)
    if c is None:
        return None, {'line': None}

    # thin bright strokes stand out against a morphological opening wider than any stroke
    k_open = max(5, round(0.009 * w)) | 1
    opened = cv2.morphologyEx(lum, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k_open, k_open)))
    tophat = lum - opened
    # overlay strokes are both far brighter than their opening and light in absolute terms; texture is neither
    strokes = (tophat > 45) & (lum > 105)

    boxes = {
        'badge': (0, max(0, c - round(0.105 * w)), round(0.13 * w), min(h, c + round(0.02 * w))),
        'text': (round(0.66 * w), max(0, c - round(0.03 * w)), round(0.99 * w), max(0, c - round(0.002 * w))),
    }
    # the ring is gold: on light stone it has little top-hat contrast, so match it by colour inside the badge box
    r, g, b = (rgb[..., i].astype(np.int16) for i in range(3))
    gold = (r - b > 45) & (r > 120) & (g > 80) & (b < 150)
    mask = np.zeros((h, w), np.uint8)
    for name, (x0, y0, x1, y1) in boxes.items():
        region = strokes[y0:y1, x0:x1]
        if name == 'badge':
            region = region | gold[y0:y1, x0:x1]
        mask[y0:y1, x0:x1][region] = 255
    # the badge: a two-tone (gold / dark teal) circle over a translucent fill — mask the whole disc
    cx, cy, r = badge_disc(rgb, c)
    cv2.circle(mask, (cx, cy), round(r * 1.12) + max(3, round(0.002 * w)), 255, thickness=-1)
    # white line plus the thin gold line a few pixels above it, full width
    mask[max(0, c - round(0.0045 * w) - 2):min(h, c + round(0.0028 * w) + 3), :] = 255

    k = max(2, round(w / 1100))
    mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * k + 1, 2 * k + 1)))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * k + 1, 2 * k + 1)))
    return mask, {'line': c, 'mask_px': int((mask > 0).sum()), 'badge': [cx, cy, r]}


# ───────────────────────────── models ─────────────────────────────

class Lama:
    def __init__(self, path: Path):
        self.model = torch.jit.load(str(path), map_location='cpu').eval()

    def __call__(self, rgb: np.ndarray, mask: np.ndarray) -> np.ndarray:
        h, w, _ = rgb.shape
        ph, pw = (8 - h % 8) % 8, (8 - w % 8) % 8
        img = np.pad(rgb, ((0, ph), (0, pw), (0, 0)), mode='reflect')
        m = np.pad(mask, ((0, ph), (0, pw)), mode='reflect')
        t_img = torch.from_numpy(np.ascontiguousarray(img)).permute(2, 0, 1).float().unsqueeze(0) / 255.0
        t_mask = (torch.from_numpy(np.ascontiguousarray(m)).float().unsqueeze(0).unsqueeze(0) > 0).float()
        with torch.inference_mode():
            out = self.model(t_img, t_mask)[0].permute(1, 2, 0).clamp(0, 1).numpy()
        out = (out * 255).round().astype(np.uint8)[:h, :w]
        keep = mask == 0
        out[keep] = rgb[keep]
        return out


class Esrgan:
    def __init__(self, path: Path):
        from spandrel import ModelLoader

        desc = ModelLoader().load_from_file(str(path))
        self.model = desc.model.eval()
        self.scale = desc.scale

    def __call__(self, rgb: np.ndarray, tile: int = 256, overlap: int = 16) -> np.ndarray:
        h, w, _ = rgb.shape
        s = self.scale
        out = np.zeros((h * s, w * s, 3), np.float32)
        weight = np.zeros((h * s, w * s, 1), np.float32)
        x = torch.from_numpy(np.ascontiguousarray(rgb)).permute(2, 0, 1).float().unsqueeze(0) / 255.0
        step = tile - overlap
        for y0 in range(0, h, step):
            for x0 in range(0, w, step):
                y1, x1 = min(h, y0 + tile), min(w, x0 + tile)
                ys, xs = max(0, y1 - tile), max(0, x1 - tile)  # full tiles at the edges
                with torch.inference_mode():
                    o = self.model(x[:, :, ys:y1, xs:x1])[0].permute(1, 2, 0).clamp(0, 1).numpy()
                out[ys * s:y1 * s, xs * s:x1 * s] += o
                weight[ys * s:y1 * s, xs * s:x1 * s] += 1
        return (out / np.maximum(weight, 1) * 255).round().astype(np.uint8)


# ───────────────────────────── jobs ─────────────────────────────

def resize_to_width(rgb: np.ndarray, width: int) -> np.ndarray:
    h, w, _ = rgb.shape
    if w == width:
        return rgb
    return np.asarray(Image.fromarray(rgb).resize((width, round(h * width / w)), Image.LANCZOS))


def qa_preview(before: np.ndarray, after: np.ndarray, mask: np.ndarray, path: Path) -> None:
    """Bottom band before / mask / after, stacked and downscaled — for a visual check of every cleaned render."""
    h, w, _ = before.shape
    y0 = int(h * 0.80)
    strip = np.concatenate([before[y0:], cv2.cvtColor(mask[y0:], cv2.COLOR_GRAY2RGB), after[y0:]], axis=0)
    scale = 1600 / strip.shape[1]
    strip = cv2.resize(strip, (1600, int(strip.shape[0] * scale)), interpolation=cv2.INTER_AREA)
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(strip).save(path, 'JPEG', quality=85)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('plan')
    default_models = Path('media-source/.models')  # local, gitignored: RealESRGAN_x4plus.pth + big-lama.pt
    ap.add_argument('--esrgan', default=os.environ.get('ESRGAN_MODEL') or (str(default_models / 'RealESRGAN_x4plus.pth') if (default_models / 'RealESRGAN_x4plus.pth').exists() else None))
    ap.add_argument('--lama', default=os.environ.get('LAMA_MODEL') or (str(default_models / 'big-lama.pt') if (default_models / 'big-lama.pt').exists() else None))
    ap.add_argument('--only', help='process only jobs whose key contains this text')
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args()

    plan = json.loads(Path(args.plan).read_text('utf8'))
    enhanced_dir = Path(args.plan).parent
    jobs = [j for j in plan['jobs'] if not args.only or args.only in j['key']]
    lama = esrgan = None
    done = skipped = 0
    t_all = time.time()
    for job in jobs:
        out = Path(job['out'])
        side = out.with_suffix(out.suffix + '.json')
        stamp = {k: job[k] for k in ('src', 'watermark', 'targetWidth', 'upscale', 'srcHash')}
        if not args.force and out.exists() and side.exists() and json.loads(side.read_text('utf8')) == stamp:
            skipped += 1
            continue
        t0 = time.time()
        rgb = load_rgb(Path(job['src']))
        notes = []
        if job['watermark']:
            mask, info = watermark_mask(rgb)
            if mask is None:
                print(f"  !! {job['key']}: no watermark line found — left untouched", file=sys.stderr)
            elif not args.lama:
                print(f"  !! {job['key']}: LAMA_MODEL not set — watermark left in place", file=sys.stderr)
            else:
                lama = lama or Lama(Path(args.lama))
                before = rgb.copy()
                y0 = max(0, int(info['line'] - 0.16 * rgb.shape[1]))  # inpaint the bottom band only
                rgb = rgb.copy()
                rgb[y0:] = lama(rgb[y0:], mask[y0:])
                qa_preview(before, rgb, mask, enhanced_dir / '_qa' / f"{job['key'].replace('/', '__')}.jpg")
                notes.append(f"watermark line@{info['line']} badge={info['badge']} mask={info['mask_px']}px")
        if job['upscale'] == 'ai':
            if not args.esrgan:
                print(f"  !! {job['key']}: ESRGAN_MODEL not set — falling back to Lanczos", file=sys.stderr)
            else:
                esrgan = esrgan or Esrgan(Path(args.esrgan))
                rgb = esrgan(rgb)
                notes.append(f"esrgan x{esrgan.scale} -> {rgb.shape[1]}")
        if job['upscale'] in ('ai', 'resize') and rgb.shape[1] != job['targetWidth']:
            rgb = resize_to_width(rgb, job['targetWidth'])
            notes.append(f"resize -> {rgb.shape[1]}")
        save_jpeg(out, rgb)
        side.write_text(json.dumps(stamp), 'utf8')
        done += 1
        print(f"  {job['key']:<70} {rgb.shape[1]}x{rgb.shape[0]}  {time.time() - t0:5.1f}s  {' | '.join(notes)}", flush=True)
    print(f"enhanced {done}, up to date {skipped}, {time.time() - t_all:.0f}s total")
    return 0


if __name__ == '__main__':
    sys.exit(main())
