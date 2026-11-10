/**
 * English-only inventory: every blog MD, forum thread, and core route in seo/en.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = path.join(root, 'src/content/blog/en');
const seoPath = path.join(root, 'src/i18n/seo/en.json');
const forumEnPath = path.join(root, 'src/i18n/forum/en.json');

function parseBlogSlug(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const end = raw.indexOf('\n---', 3);
  if (end < 0) return path.basename(filePath, '.md');
  const data = JSON.parse(raw.slice(3, end));
  return data.slug || path.basename(filePath, '.md');
}

const blogSlugs = fs.existsSync(blogDir)
  ? fs
      .readdirSync(blogDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => parseBlogSlug(path.join(blogDir, f)))
  : [];

const forumSlugs = fs.existsSync(forumEnPath)
  ? Object.keys(JSON.parse(fs.readFileSync(forumEnPath, 'utf8')).posts ?? {})
  : [];

const errors = [];

if (!fs.existsSync(seoPath)) {
  errors.push('Missing src/i18n/seo/en.json — run npm run i18n:export-all');
} else {
  const seo = JSON.parse(fs.readFileSync(seoPath, 'utf8'));
  const pages = seo.pages ?? {};

  for (const slug of blogSlugs) {
    const key = `/blog/${slug}/`;
    if (!pages[key]?.title || !pages[key]?.description) {
      errors.push(`SEO bundle missing blog page ${key}`);
    }
  }
  for (const slug of forumSlugs) {
    const key = `/forum/${slug}/`;
    if (!pages[key]?.title || !pages[key]?.description) {
      errors.push(`SEO bundle missing forum page ${key}`);
    }
  }

  const blogSeoSlugs = Object.keys(pages)
    .filter((k) => k.startsWith('/blog/') && k !== '/blog/')
    .map((k) => k.slice('/blog/'.length, -1));
  const forumSeoSlugs = Object.keys(pages)
    .filter((k) => k.startsWith('/forum/') && k !== '/forum/')
    .map((k) => k.slice('/forum/'.length, -1));

  if (blogSeoSlugs.length !== blogSlugs.length) {
    errors.push(`Blog SEO entries ${blogSeoSlugs.length} vs ${blogSlugs.length} markdown post(s)`);
  }
  if (forumSeoSlugs.length !== forumSlugs.length) {
    errors.push(`Forum SEO entries ${forumSeoSlugs.length} vs ${forumSlugs.length} thread(s) in forum/en.json`);
  }

  const core = [
    '/',
    '/blog/',
    '/forum/',
    '/faq/',
    '/status/',
    '/products/apex-cheats/',
    '/products/apex-cheats/loader/',
    '/products/apex-cheats/hwid-spoofer/',
    '/products/apex-cheats/utilities/',
  ];
  for (const key of core) {
    if (!pages[key]?.title) errors.push(`SEO bundle missing core route ${key}`);
  }
}

console.log(
  `Content inventory: ${blogSlugs.length} blog post(s), ${forumSlugs.length} forum thread(s), English only.`,
);

if (errors.length) {
  console.error(errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('Content inventory check passed.');
