/**
 * Split Gemini_Generated_Image_* sheet into header logo + favicon sources.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const manualLogo = path.join(root, 'logo.jpg');
const manualIcon = path.join(root, 'favicon.jpg');
if (fs.existsSync(manualLogo) && fs.existsSync(manualIcon)) {
  console.log('split-gemini-brand: skipped (logo.jpg + favicon.jpg at repo root)');
  process.exit(0);
}

const sheet =
  fs
    .readdirSync(root)
    .find((n) => /^Gemini_Generated_Image_.*\.jpe?g$/i.test(n)) ??
  path.join(root, 'Gemini_Generated_Image_xrixt2xrixt2xrix.jpg');

if (!fs.existsSync(sheet)) {
  console.log('split-gemini-brand: no Gemini sheet found — keeping brand-incoming/*.webp');
  process.exit(0);
}

const sheetPath = path.isAbsolute(sheet) ? sheet : path.join(root, sheet);
const outDir = path.join(root, 'brand-incoming');
fs.mkdirSync(outDir, { recursive: true });

const meta = await sharp(sheetPath).metadata();
const w = meta.width ?? 2752;
const h = meta.height ?? 1536;

/** Sheet layout: main logo left, favicon square right (below "FAVICON" label). */
const logoCrop = {
  left: Math.round(w * 0.08),
  top: Math.round(h * 0.22),
  width: Math.round(w * 0.5),
  height: Math.round(h * 0.68),
};

const faviconCrop = {
  left: Math.round(w * 0.71),
  top: Math.round(h * 0.38),
  width: Math.round(w * 0.19),
  height: Math.round(w * 0.19),
};

const logoOut = path.join(outDir, 'logo.webp');
const faviconOut = path.join(outDir, 'favicon.webp');
const sheetPreview = path.join(outDir, 'sheet-preview.webp');

async function cropSquare(input, region, size) {
  const side = Math.min(region.width, region.height);
  const buf = await sharp(sheetPath)
    .extract({
      left: region.left + Math.floor((region.width - side) / 2),
      top: region.top + Math.floor((region.height - side) / 2),
      width: side,
      height: side,
    })
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .webp({ quality: 92 })
    .toBuffer();
  return buf;
}

await sharp(sheetPath).resize(1200).webp({ quality: 80 }).toFile(sheetPreview);
fs.writeFileSync(logoOut, await cropSquare(sheetPath, logoCrop, 512));
fs.writeFileSync(faviconOut, await cropSquare(sheetPath, faviconCrop, 512));

console.log(`split-gemini-brand: ${path.basename(sheetPath)} → brand-incoming/logo.webp + favicon.webp`);
