/**
 * Build header logo + favicons from brand-incoming/logo.webp, or logo.jpg / favicon.jpg at repo root.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import pngToIco from 'png-to-ico';

const root = join(import.meta.dirname, '..');
const publicDir = join(root, 'public');

/** Root logo.jpg / favicon.jpg win over brand-incoming (fresh manual uploads). */
function pickBrandSource() {
  const candidates = [
    join(root, 'logo.jpg'),
    join(root, 'logo.webp'),
    join(root, 'brand-incoming', 'logo.webp'),
    join(root, 'favicon.jpg'),
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}

function pickFaviconSource() {
  const candidates = [
    join(root, 'favicon.jpg'),
    join(root, 'favicon.webp'),
    join(root, 'brand-incoming', 'favicon.webp'),
    join(root, 'brand-incoming', 'logo.webp'),
    join(root, 'logo.jpg'),
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}

function squareIcon(input) {
  return sharp(input)
    .resize(512, 512, {
      fit: 'contain',
      position: 'centre',
      background: { r: 10, g: 13, b: 16, alpha: 1 },
    });
}

async function syncBrandIncoming(logoSrc, faviconSrc) {
  const incoming = join(root, 'brand-incoming');
  mkdirSync(incoming, { recursive: true });
  await sharp(logoSrc).webp({ quality: 92 }).toFile(join(incoming, 'logo.webp'));
  await sharp(faviconSrc).webp({ quality: 92 }).toFile(join(incoming, 'favicon.webp'));
}

/** Wide header mark — keep aspect ratio (favicon stays square). */
async function buildHeaderLogo(src) {
  const outWebp = join(publicDir, 'logo.webp');
  const outPng = join(publicDir, 'logo.png');
  const pipeline = sharp(src).resize(512, 192, {
    fit: 'inside',
    withoutEnlargement: false,
    background: { r: 10, g: 13, b: 16, alpha: 0 },
  });
  await pipeline.clone().webp({ quality: 90 }).toFile(outWebp);
  await pipeline.clone().png().toFile(outPng);
}

async function buildFavicons(src) {
  const base = squareIcon(src);
  const sizes = [
    { name: 'favicon-16.png', size: 16 },
    { name: 'favicon-32.png', size: 32 },
    { name: 'favicon-48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];

  const icoBuffers = [];
  for (const { name, size } of sizes) {
    const buf = await base.clone().resize(size, size).png().toBuffer();
    writeFileSync(join(publicDir, name), buf);
    if (size === 16 || size === 32 || size === 48) {
      icoBuffers.push(buf);
    }
  }

  writeFileSync(join(publicDir, 'favicon.ico'), await pngToIco(icoBuffers));
  await base.clone().resize(32, 32).png().toFile(join(publicDir, 'favicon.png'));
}

const logoSrc = pickBrandSource();
if (!logoSrc) {
  console.error('No brand source — add Gemini sheet, brand-incoming/logo.webp, or logo.jpg');
  process.exit(1);
}

const faviconSrc = pickFaviconSource() ?? logoSrc;

await syncBrandIncoming(logoSrc, faviconSrc);
await buildHeaderLogo(logoSrc);
await buildFavicons(faviconSrc);

console.log(`Brand assets: logo ← ${logoSrc.replace(root, '.')}, favicon ← ${faviconSrc.replace(root, '.')}`);
