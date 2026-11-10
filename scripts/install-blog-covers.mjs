/**
 * Blog featured images (1200×630 WebP) from apex-22-images.zip + frontmatter patch.
 * Run: node scripts/install-blog-covers.mjs && node scripts/optimize-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';

const root = process.cwd();
const zipPath = path.join(root, 'apex-22-images.zip');
const srcDir = path.join(root, '_apex-22-extract');
const blogOut = path.join(root, 'public/images/blog');
const blogMdRoot = path.join(root, 'src/content/blog');
const intrinsicPath = path.join(root, 'src/data/image-intrinsic.json');

const W = 1200;
const H = 630;

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

function findSource(name) {
  const direct = path.join(srcDir, name);
  if (!fs.existsSync(direct)) throw new Error(`Missing source: ${name}`);
  return direct;
}

const LETTERBOX = { r: 10, g: 12, b: 16, alpha: 1 };

/** Fit entire source in 1200×630 — no crops (letterbox on dark background). */
async function pipelineFromJob(job) {
  const pipe = sharp(findSource(job.src));
  return pipe.resize(W, H, { fit: 'contain', background: LETTERBOX });
}

/** @type {Array<{ slug: string; out: string; alt: string; src: string }>} */
const JOBS = [
  {
    slug: 'apex-esp-guide',
    out: 'apex-esp-guide-indoor-wallhack-sector.webp',
    alt: 'Indoor Apex Legends fight with enemy outlines through walls for ESP callouts',
    src: 'apex5.webp',
  },
  {
    slug: 'apex-aimbot-mechanics',
    out: 'apex-aimbot-mechanics-menu-aimbot-full.webp',
    alt: 'Full Apex Legends cheat menu Aimbot tab with smoothing and FOV options',
    src: 'zadeyo-apexlegends-3-aimbot.webp',
  },
  {
    slug: 'skeleton-esp-hitboxes',
    out: 'skeleton-esp-hitboxes-menu-visuals-full.webp',
    alt: 'Full Apex Legends Player Visuals menu with skeleton and box ESP toggles',
    src: 'zadeyo-apexlegends-1-visuals.webp',
  },
  {
    slug: 'box-esp-matches',
    out: 'box-esp-matches-gameplay-boxes-full.webp',
    alt: 'Apex Legends team fight with corner box ESP on multiple players',
    src: 'apex1.webp',
  },
  {
    slug: 'health-bar-push-strategy',
    out: 'health-bar-push-strategy-elevated-fight-full.webp',
    alt: 'Apex Legends elevated fight with shield and health bar ESP above enemies',
    src: 'apex9.webp',
  },
  {
    slug: 'distance-esp-ranges',
    out: 'distance-esp-ranges-ring-meters-full.webp',
    alt: 'Apex Legends ring countdown with distance ESP meter labels',
    src: 'apex7.webp',
  },
  {
    slug: 'loot-esp-drop-strategy',
    out: 'loot-esp-drop-strategy-menu-world-full.webp',
    alt: 'Full Apex Legends World and Loot menu with ESP filter toggles',
    src: 'zadeyo-apexlegends-3-world.webp',
  },
  {
    slug: 'weapon-esp-looting',
    out: 'weapon-esp-looting-inmatch-full.webp',
    alt: 'Apex Legends in-match scene with squad overlays during a loot rotate',
    src: 'apex4.webp',
  },
  {
    slug: 'no-recoil-spray-patterns',
    out: 'no-recoil-spray-patterns-menu-aimbot-full.webp',
    alt: 'Full Apex Legends Aimbot menu with weapon recoil control sliders',
    src: 'zadeyo-apexlegends-3-aimbot.webp',
  },
  {
    slug: 'stream-proof-creators',
    out: 'stream-proof-creators-menu-misc-full.webp',
    alt: 'Full Apex Legends Misc menu with stream-proof and general settings',
    src: 'zadeyo-apexlegends-4-misc.webp',
  },
  {
    slug: 'apex-anticheat',
    out: 'apex-anticheat-long-range-esp-full.webp',
    alt: 'Apex Legends long-range engagement with squad ESP overlays',
    src: 'ap1.webp',
  },
  {
    slug: 'apex-dma-cheats',
    out: 'apex-dma-cheats-open-lane-full.webp',
    alt: 'Apex Legends open lane with player tags across terrain',
    src: 'ap1.webp',
  },
  {
    slug: 'apex-hacks-explained',
    out: 'apex-hacks-explained-ads-target-full.webp',
    alt: 'First-person Apex Legends aim-down-sights view with boxed enemy',
    src: 'apex3.webp',
  },
  {
    slug: 'best-apex-cheats',
    out: 'best-apex-cheats-rooftop-squad-full.webp',
    alt: 'Apex Legends rooftop fight with multiple player ESP markers',
    src: 'apex11.webp',
  },
  {
    slug: 'hwid-spoofer-explained',
    out: 'hwid-spoofer-explained-phoenix-hero.webp',
    alt: 'HWID spoofer splash screen for Apex Legends on Windows PC',
    src: 'phoenix-apex-xray-s1.webp',
  },
  {
    slug: 'reliable-247-support',
    out: 'reliable-247-support-ring-pressure-full.webp',
    alt: 'Apex Legends ring pressure scene with squad HUD readouts',
    src: 'apex7.webp',
  },
];

function splitFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return null;
  const end = normalized.indexOf('\n---\n', 4);
  if (end === -1) return null;
  return {
    json: normalized.slice(4, end),
    body: normalized.slice(end + 5),
  };
}

function patchBlogFrontmatter() {
  const bySlug = Object.fromEntries(JOBS.map((j) => [j.slug, j]));
  let count = 0;

  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.md')) {
        const parts = splitFrontmatter(fs.readFileSync(p, 'utf8'));
        if (!parts) continue;
        let data;
        try {
          data = JSON.parse(parts.json);
        } catch {
          continue;
        }
        const job = bySlug[data.slug];
        if (!job) continue;
        const image = `/images/blog/${job.out}`;
        const locale = path.relative(blogMdRoot, p).split(path.sep)[0] ?? 'en';
        data.image = image;
        if (locale === 'en') data.imageAlt = job.alt;
        const out = `---\n${JSON.stringify(data, null, 2)}\n---\n${parts.body}`;
        fs.writeFileSync(p, out, 'utf8');
        count += 1;
      }
    }
  }

  walk(blogMdRoot);
  return count;
}

async function main() {
  ensureExtracted();
  fs.mkdirSync(blogOut, { recursive: true });

  const intrinsic = fs.existsSync(intrinsicPath)
    ? JSON.parse(fs.readFileSync(intrinsicPath, 'utf8'))
    : {};

  for (const job of JOBS) {
    const dest = path.join(blogOut, job.out);
    const pipe = await pipelineFromJob(job);
    await pipe.webp({ quality: 84, effort: 5 }).toFile(dest);
    const kb = (fs.statSync(dest).size / 1024).toFixed(1);
    console.log(`cover ${job.out} ${kb}KB`);
    const url = `/images/blog/${job.out}`;
    intrinsic[url] = { width: W, height: H };
  }

  fs.writeFileSync(intrinsicPath, `${JSON.stringify(intrinsic, null, 2)}\n`);

  const patched = patchBlogFrontmatter();
  console.log(`Patched ${patched} blog markdown file(s); wrote ${path.relative(root, intrinsicPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
