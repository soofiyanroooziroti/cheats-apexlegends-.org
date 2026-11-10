/**
 * Build hero + product WebPs from apex-22-images.zip (project root).
 * Run: node scripts/install-apex-images.mjs && node scripts/optimize-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

const root = process.cwd();
const zipPath = path.join(root, 'apex-22-images.zip');
const srcDir = path.join(root, '_apex-22-extract');
const gameplayDir = path.join(root, 'public/images/gameplay');
const productsDir = path.join(root, 'public/images/products');
const intrinsicPath = path.join(root, 'src/data/image-intrinsic.json');

const MAX_HERO_BYTES = 90 * 1024;

function ensureExtracted() {
  if (fs.existsSync(srcDir) && fs.readdirSync(srcDir).some((f) => f.endsWith('.webp'))) return;
  if (!fs.existsSync(zipPath)) {
    console.error('Missing apex-22-images.zip in project root.');
    process.exit(1);
  }
  fs.mkdirSync(srcDir, { recursive: true });
  const ps = spawnSync(
    'powershell',
    [
      '-NoProfile',
      '-Command',
      `Expand-Archive -Path '${zipPath.replace(/'/g, "''")}' -DestinationPath '${srcDir.replace(/'/g, "''")}' -Force`,
    ],
    { stdio: 'inherit' },
  );
  if (ps.status !== 0) process.exit(ps.status ?? 1);
}

function rmDirWebp(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (/\.webp$/i.test(name)) fs.unlinkSync(path.join(dir, name));
  }
}

async function writeHeroWebp(pipeline, destRel) {
  const dest = path.join(root, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let lo = 42;
  let hi = 88;
  let best = null;
  while (lo <= hi) {
    const q = Math.floor((lo + hi) / 2);
    const buf = await pipeline
      .clone()
      .resize(1280, 720, { fit: 'cover', position: 'centre' })
      .webp({ quality: q, effort: 6 })
      .toBuffer();
    if (buf.length <= MAX_HERO_BYTES) {
      best = buf;
      lo = q + 1;
    } else {
      hi = q - 1;
    }
  }
  if (!best) {
    best = await pipeline
      .clone()
      .resize(1280, 720, { fit: 'cover', position: 'centre' })
      .webp({ quality: 40, effort: 6 })
      .toBuffer();
  }
  fs.writeFileSync(dest, best);
  const kb = (best.length / 1024).toFixed(1);
  console.log(`Wrote ${destRel} (${kb} KB)`);
  return { width: 1280, height: 720, bytes: best.length };
}

async function writeProductWebp(pipeline, destRel) {
  const dest = path.join(root, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const meta = await pipeline.clone().metadata();
  const buf = await pipeline.clone().webp({ quality: 86, effort: 4 }).toBuffer();
  fs.writeFileSync(dest, buf);
  const info = await sharp(buf).metadata();
  console.log(`Wrote ${destRel} (${info.width}x${info.height}, ${(buf.length / 1024).toFixed(1)} KB)`);
  return { width: info.width ?? meta.width ?? 960, height: info.height ?? meta.height ?? 540, bytes: buf.length };
}

async function processHero({ src, dest, preCrop }) {
  let pipe = sharp(path.join(srcDir, src));
  if (preCrop) {
    const meta = await pipe.metadata();
    const { left, top, width, height } = preCrop(meta);
    pipe = pipe.extract({
      left: Math.max(0, Math.round(left)),
      top: Math.max(0, Math.round(top)),
      width: Math.min(Math.round(width), (meta.width ?? width) - Math.round(left)),
      height: Math.min(Math.round(height), (meta.height ?? height) - Math.round(top)),
    });
  }
  return writeHeroWebp(pipe, dest);
}

const HERO = [
  {
    src: 'ap1.webp',
    dest: 'public/images/gameplay/apex-hero-floating-base-esp.webp',
  },
  {
    src: 'apex5.webp',
    dest: 'public/images/gameplay/apex-hero-bunk-room-wallhack.webp',
    preCrop: () => ({ left: 200, top: 48, width: 824, height: 456 }),
  },
  { src: 'apex7.webp', dest: 'public/images/gameplay/apex-hero-ring-countdown-esp.webp' },
  { src: 'apex9.webp', dest: 'public/images/gameplay/apex-hero-skyway-player-tags.webp' },
  { src: 'apex3.webp', dest: 'public/images/gameplay/apex-hero-ads-target-box-esp.webp' },
  { src: 'apex11.webp', dest: 'public/images/gameplay/apex-hero-rooftop-squad-esp.webp' },
];

/** Loader gallery — full screenshots, uncropped (sources renamed on output). */
const PRODUCTS = [
  {
    src: 'zadeyo-apexlegends-3-aimbot.webp',
    dest: 'public/images/products/apex-legends-menu-aimbot-full.webp',
  },
  {
    src: 'zadeyo-apexlegends-3-world.webp',
    dest: 'public/images/products/apex-legends-menu-world-full.webp',
  },
  {
    src: 'zadeyo-apexlegends-1-visuals.webp',
    dest: 'public/images/products/apex-legends-menu-visuals-full.webp',
  },
  {
    src: 'zadeyo-apexlegends-4-misc.webp',
    dest: 'public/images/products/apex-legends-menu-misc-full.webp',
  },
];

/** Same three Phoenix assets as cheats-for-cs2-.com (copied, not cropped). */
const CS2_SPOOFER_DIR = path.join(root, '..', 'cheats-for-cs2-.com', 'public', 'images', 'products');
const SPOOFER_COPY = [
  ['cs2-spoofer-hero.webp', 'apex-spoofer-hero.webp'],
  ['cs2-spoofer-phoenix-board.webp', 'apex-spoofer-phoenix-board.webp'],
  ['cs2-spoofer-phoenix-wh.webp', 'apex-spoofer-phoenix-wh.webp'],
];

async function copySpooferFromCs2(intrinsic) {
  for (const [from, outName] of SPOOFER_COPY) {
    const src = path.join(CS2_SPOOFER_DIR, from);
    if (!fs.existsSync(src)) {
      console.error(`Missing CS2 spoofer asset: ${src}`);
      process.exit(1);
    }
    const dest = path.join(productsDir, outName);
    fs.copyFileSync(src, dest);
    const meta = await sharp(dest).metadata();
    const rel = `/images/products/${outName}`;
    intrinsic[rel] = {
      width: meta.width ?? 960,
      height: meta.height ?? 540,
      bytes: fs.statSync(dest).size,
    };
    console.log(`Copied spoofer ${outName} from CS2 (${meta.width}x${meta.height})`);
  }
}

ensureExtracted();
rmDirWebp(gameplayDir);
rmDirWebp(productsDir);

const intrinsic = {};

for (const job of HERO) {
  const rel = job.dest.replace(/^public[/\\]/, '/').replace(/\\/g, '/');
  intrinsic[rel] = await processHero(job);
}

for (const job of PRODUCTS) {
  const pipe = sharp(path.join(srcDir, job.src));
  const rel = job.dest.replace(/^public[/\\]/, '/').replace(/\\/g, '/');
  intrinsic[rel] = await writeProductWebp(pipe, job.dest);
}

await copySpooferFromCs2(intrinsic);

fs.writeFileSync(intrinsicPath, `${JSON.stringify(intrinsic, null, 2)}\n`);
console.log(`Wrote ${path.relative(root, intrinsicPath)}`);
