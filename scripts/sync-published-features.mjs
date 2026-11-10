/**
 * Align locale JSON module titles with English (12 menu features) — preserve translated subtitles.
 * Run after: npx tsx scripts/generate-i18n-entry.ts --en-only
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nonDefaultShipLocales } from './locale-ship.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const i18nDir = path.join(root, 'src/i18n');
const en = JSON.parse(fs.readFileSync(path.join(i18nDir, 'en.json'), 'utf8'));

const locales = nonDefaultShipLocales.filter((code) =>
  fs.existsSync(path.join(i18nDir, `${code}.json`)),
);

const TEXT_REPLACEMENTS = [
  [/Rank ESP/gi, 'Distance ESP'],
  [/legend ESP,\s*/gi, ''],
  [/,\s*legend ESP/gi, ''],
  [/rank ESP,\s*/gi, ''],
  [/,\s*rank ESP/gi, ''],
  [/Map hack \/ ESP/g, 'ESP'],
  [/Javelin versus VAC/gi, 'Javelin patch notes'],
  [/Javelin and VAC/gi, 'Javelin'],
  [/Javelin et VAC/gi, 'Javelin'],
  [/Javelin y VAC/gi, 'Javelin'],
  [/Javelin und VAC/gi, 'Javelin'],
  [/player ESP, legend ESP, ESP/gi, 'Player ESP, Weapon ESP, Box ESP'],
];

function deepReplaceStrings(value) {
  if (typeof value === 'string') {
    let s = value;
    for (const [re, rep] of TEXT_REPLACEMENTS) s = s.replace(re, rep);
    return s;
  }
  if (Array.isArray(value)) return value.map(deepReplaceStrings);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepReplaceStrings(v);
    return out;
  }
  return value;
}

function mergeFeatureItems(enItems, locItems) {
  if (!Array.isArray(enItems)) return locItems;
  return enItems.map((enItem, i) => {
    const loc = Array.isArray(locItems) ? locItems[i] : undefined;
    const enSubtitle = typeof enItem?.subtitle === 'string' ? enItem.subtitle : '';
    const locSubtitle = typeof loc?.subtitle === 'string' ? loc.subtitle : '';
    const keepSubtitle = locSubtitle && locSubtitle !== enSubtitle;
    return {
      ...enItem,
      ...(keepSubtitle ? { subtitle: locSubtitle } : {}),
    };
  });
}

for (const code of locales) {
  const fp = path.join(i18nDir, `${code}.json`);
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (en.features?.items) {
    data.features = {
      ...(data.features ?? {}),
      ...en.features,
      items: mergeFeatureItems(en.features.items, data.features?.items),
    };
  }
  const cleaned = deepReplaceStrings(data);
  fs.writeFileSync(fp, `${JSON.stringify(cleaned, null, 2)}\n`, 'utf8');
  console.log(`sync-published-features: ${code}.json`);
}
