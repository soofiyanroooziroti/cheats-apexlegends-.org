/**
 * Drop stale DayZ / Warzone / Valorant FAQ & status blocks from locale JSON so English Apex copy wins via deepMerge.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const i18nDir = path.join(root, 'src/i18n');
const productDir = path.join(i18nDir, 'product');

const LEGACY_RE =
  /Badlands|1\.31|1\.30|Nitrado|Nasdara|BattlEye|DayZ|dayz-cheats|infected ESP|Infectados|infectados|Vehicle ESP|helicrash|Lite, Pro|item ESP|Loot ESP|Steam 15|PS5 native|ESP de animais|ESP de animales|No clip|terceira pessoa|Survie|Raids de bases|Basen-Raids|Sessions loot|Loot sessions|PvP surviv/i;

function jsonHasLegacy(value) {
  if (typeof value === 'string') return LEGACY_RE.test(value);
  if (Array.isArray(value)) return value.some(jsonHasLegacy);
  if (value && typeof value === 'object') {
    return Object.values(value).some(jsonHasLegacy);
  }
  return false;
}

function stripKey(obj, key) {
  if (obj && typeof obj === 'object' && key in obj) {
    delete obj[key];
    return true;
  }
  return false;
}

function replaceInTree(value) {
  if (typeof value === 'string') {
    return value
      .replaceAll('valorant-cheats', 'apex-cheats')
      .replaceAll('/products/valorant-cheats/', '/products/apex-cheats/')
      .replaceAll('dayz-cheats', 'apex-cheats')
      .replaceAll('/products/dayz-cheats/', '/products/apex-cheats/')
      .replaceAll('Valorant Cheats', 'Apex cheats')
      .replaceAll('VALORANT', 'Apex Legends')
      .replaceAll('DayZ Cheats', 'Apex cheats')
      .replaceAll('DayZ', 'Apex Legends');
  }
  if (Array.isArray(value)) return value.map(replaceInTree);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = replaceInTree(v);
    }
    return out;
  }
  return value;
}

function purgeLocaleFile(filePath) {
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;

  if (data.faq?.items && jsonHasLegacy(data.faq.items)) {
    stripKey(data.faq, 'items');
    changed = true;
  }

  if (data.status?.updates) {
    stripKey(data.status, 'updates');
    changed = true;
  }

  if (data.status?.pageDesc && LEGACY_RE.test(data.status.pageDesc)) {
    stripKey(data.status, 'pageDesc');
    changed = true;
  }

  if (data.site?.description && LEGACY_RE.test(data.site.description)) {
    stripKey(data.site, 'description');
    changed = true;
  }

  if (data.features && jsonHasLegacy(data.features)) {
    stripKey(data, 'features');
    changed = true;
  }

  if (data.setup && jsonHasLegacy(data.setup)) {
    stripKey(data, 'setup');
    changed = true;
  }

  if (data.workflow && jsonHasLegacy(data.workflow)) {
    stripKey(data, 'workflow');
    changed = true;
  }

  if (data.toolkit && jsonHasLegacy(data.toolkit)) {
    stripKey(data, 'toolkit');
    changed = true;
  }

  if (data.cheats && jsonHasLegacy(data.cheats)) {
    stripKey(data, 'cheats');
    changed = true;
  }

  if (data.hero?.modes && jsonHasLegacy(data.hero.modes)) {
    stripKey(data.hero, 'modes');
    changed = true;
  }

  if (data.hero?.modesLabel && LEGACY_RE.test(String(data.hero.modesLabel))) {
    stripKey(data.hero, 'modesLabel');
    changed = true;
  }

  if (data.legalPages && jsonHasLegacy(data.legalPages)) {
    const about = data.legalPages.about;
    if (about?.sections && jsonHasLegacy(about.sections)) {
      stripKey(data.legalPages, 'about');
      changed = true;
    }
  }

  const next = replaceInTree(data);
  if (JSON.stringify(next) !== JSON.stringify(data)) {
    data = next;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
    return true;
  }
  return false;
}

let files = 0;
for (const name of fs.readdirSync(i18nDir)) {
  if (!name.endsWith('.json') || name === 'en.json' || name === 'glossary.json') continue;
  if (purgeLocaleFile(path.join(i18nDir, name))) files += 1;
}

for (const name of fs.readdirSync(productDir)) {
  if (!name.endsWith('.json') || name === 'en.json') continue;
  const filePath = path.join(productDir, name);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;
  if (data.cheats && jsonHasLegacy(data.cheats)) {
    delete data.cheats;
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
    files += 1;
  }
}

console.log(`purge-legacy-game-i18n: updated ${files} locale files`);
