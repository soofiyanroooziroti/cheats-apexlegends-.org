/**
 * Remove legacy DayZ SEO keys and fix broken markdown link closings in locale JSON.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const seoDir = path.join(root, 'src/i18n/seo');
const enSeo = JSON.parse(fs.readFileSync(path.join(seoDir, 'en.json'), 'utf8'));
const enPageKeys = new Set(Object.keys(enSeo.pages ?? {}));

const MD_FIXES = [
  ['(/support/).)', '(/support/)'],
  ['(/support/).', '(/support/)'],
  ['(/support/)..', '(/support/)'],
  ['(/forum/)).', '(/forum/)'],
  ['(/blog/)).', '(/blog/)'],
  ['loader/))', 'loader/)'],
  ['loader/),)', 'loader/)'],
  ['apex-cheats/))', 'apex-cheats/)'],
  ['apex-cheats/),)', 'apex-cheats/)'],
  ['hwid-spoofer/),)', 'hwid-spoofer/)'],
  ['hwid-spoofer/),', 'hwid-spoofer/),'],
  ['ugc/).)', 'ugc/)'],
  ['ugc/).', 'ugc/)'],
  ['/loader/))', '/loader/)'],
  ['/apex-cheats/))', '/apex-cheats/)'],
  ['(/blog/))', '(/blog/)'],
  ['(/forum/))', '(/forum/)'],
  ['(/terms/))', '(/terms/)'],
  ['(/support/) Veuillez', '(/support/). Veuillez'],
  ['(/support/) Incluya', '(/support/). Incluya'],
  ['(/support/).).', '(/support/).'],
];

const LEGACY_SEO = /^\/blog\/(?:best-dayz|how-to-download-dayz|dayz-)/;

function scrubText(text) {
  let out = text;
  for (const [from, to] of MD_FIXES) {
    out = out.split(from).join(to);
  }
  return out;
}

let n = 0;
for (const file of fs.readdirSync(path.join(root, 'src/i18n'))) {
  if (!file.endsWith('.json') || file === 'glossary.json') continue;
  const p = path.join(root, 'src/i18n', file);
  const fixed = scrubText(fs.readFileSync(p, 'utf8'));
  if (fixed !== fs.readFileSync(p, 'utf8')) {
    fs.writeFileSync(p, fixed);
    n += 1;
  }
}

for (const file of fs.readdirSync(seoDir)) {
  if (!file.endsWith('.json') || file === 'en.json') continue;
  const p = path.join(seoDir, file);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const pages = data.pages ?? {};
  let changed = false;
  for (const key of Object.keys(pages)) {
    if (!enPageKeys.has(key) || LEGACY_SEO.test(key)) {
      delete pages[key];
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`);
    n += 1;
  }
}

console.log(`scrub-locale-artifacts: touched ${n} files`);
