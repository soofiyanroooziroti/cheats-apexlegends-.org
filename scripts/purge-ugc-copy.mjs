/**
 * Remove UGC product copy and links from generated locale JSON and blog markdown.
 * Run after source edits: node scripts/purge-ugc-copy.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const UGC_PATH_RE = /\/products\/[^/]+\/ugc\/?/gi;
const UGC_GO_RE = /\/go\/ugc\/?/gi;

function scrubString(value) {
  if (typeof value !== 'string' || !value) return value;
  let s = value
    .replace(UGC_PATH_RE, '/products/apex-cheats/hwid-spoofer/')
    .replace(UGC_GO_RE, '/products/apex-cheats/hwid-spoofer/')
    .replace(/\bUGC Account recovery\b/gi, '')
    .replace(/\bUGC Account Recovery\b/g, '')
    .replace(/\bUGC recovery\b/gi, '')
    .replace(/\bUGC account recovery\b/gi, '')
    .replace(/\bUGC\b/g, '')
    .replace(/,\s*,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;])/g, '$1')
  .trim();
  if (s === 'and' || s === ',') return '';
  return s;
}

function scrubValue(value) {
  if (typeof value === 'string') return scrubString(value);
  if (Array.isArray(value)) {
    const next = value
      .map(scrubValue)
      .filter((entry) => entry !== null && entry !== undefined && entry !== '');
    return next.filter((entry) => {
      if (typeof entry === 'object' && entry && 'href' in entry && typeof entry.href === 'string') {
        return !entry.href.includes('/ugc');
      }
      return true;
    });
  }
  if (value && typeof value === 'object') {
    if ('slug' in value && value.slug === 'ugc') return undefined;
    if ('href' in value && typeof value.href === 'string' && value.href.includes('/ugc')) return undefined;
    const out = {};
    for (const [key, child] of Object.entries(value)) {
      if (key === 'ugc') continue;
      if (key === 'buyUgcRecovery') continue;
      if (key === 'ugcRecovery') continue;
      if (key.startsWith('/products/') && key.includes('/ugc/')) continue;
      const scrubbed = scrubValue(child);
      if (scrubbed !== undefined) out[key] = scrubbed;
    }
    return out;
  }
  return value;
}

function walkJsonFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJsonFiles(full, acc);
    else if (ent.name.endsWith('.json')) acc.push(full);
  }
  return acc;
}

function walkMarkdown(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkMarkdown(full, acc);
    else if (ent.name.endsWith('.md')) acc.push(full);
  }
  return acc;
}

const jsonTargets = [
  path.join(root, 'src/i18n'),
  path.join(root, 'scripts'),
].flatMap((d) => walkJsonFiles(d));

let jsonCount = 0;
for (const file of jsonTargets) {
  if (file.includes('node_modules')) continue;
  const raw = fs.readFileSync(file, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    continue;
  }
  const next = scrubValue(data);
  const out = `${JSON.stringify(next, null, 2)}\n`;
  if (out !== raw) {
    fs.writeFileSync(file, out);
    jsonCount++;
  }
}

let mdCount = 0;
for (const file of walkMarkdown(path.join(root, 'src/content/blog'))) {
  const raw = fs.readFileSync(file, 'utf8');
  if (!/\bugc\b/i.test(raw)) continue;
  const end = raw.indexOf('\n---', 3);
  const head = end >= 0 ? raw.slice(0, end + 4) : raw;
  const body = end >= 0 ? raw.slice(end + 4) : '';
  let jsonPart = head;
  if (end >= 0) {
    try {
      const data = JSON.parse(raw.slice(3, end));
      const scrubbed = scrubValue(data);
      jsonPart = `---\n${JSON.stringify(scrubbed, null, 2)}\n---`;
    } catch {
      jsonPart = scrubString(head);
    }
  }
  const newBody = scrubString(body);
  const out = jsonPart + newBody;
  if (out !== raw) {
    fs.writeFileSync(file, out);
    mdCount++;
  }
}

console.log(`purge-ugc-copy: updated ${jsonCount} JSON file(s), ${mdCount} blog markdown file(s).`);
