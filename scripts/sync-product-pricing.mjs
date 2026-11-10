/**
 * Site-wide pricing: two plans per product — no $30, $60, $100, or 90-day tiers.
 * Menu & UGC: $35 / 31 days + $150 lifetime. Spoofer: $50 / 31 days + $150 lifetime.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');

const MENU = 'The menu is $35 for 31 days or $150 lifetime';
const UGC = 'UGC is $35 for 31 days or $150 lifetime';
const SPOOFER = 'The HWID spoofer is $50 for 31 days or $150 lifetime';
const ALL = `${MENU}. ${UGC}. ${SPOOFER}`;

const REPLACEMENTS = [
  ['$30 for 30 days, $60 for 90 days, or $150 lifetime', '$35 for 31 days or $150 lifetime'],
  ['$30 for 30 days, $60 for 90 days, and $150 lifetime', '$35 for 31 days and $150 lifetime'],
  ['$30, $60, or $150', '$35 or $150'],
  ['$30, $60, and $150', '$35 and $150'],
  ['$30 / $60 / $150', '$35 / $150'],
  ['$50, $100, or $150', '$50 or $150'],
  ['$50, $100, and $150', '$50 and $150'],
  ['$50 / $100 / $150', '$50 / $150'],
  ['$50 for 30 days, $100 for 90 days, or $150 lifetime', '$50 for 31 days or $150 lifetime'],
  ['$35 for 30 days or $150 lifetime', '$35 for 31 days or $150 lifetime'],
  ['$35 for 30 days and $150 lifetime', '$35 for 31 days and $150 lifetime'],
  ['The menu is $35 for 30 days or $150 lifetime', MENU],
  [
    'The menu is $35 for 30 days or $150 lifetime. UGC is $30 for 30 days, $60 for 90 days, or $150 lifetime',
    ALL,
  ],
  [
    'The menu is $35 for 30 days or $150 lifetime. UGC is $35 for 30 days, $60 for 90 days, or $150 lifetime',
    ALL,
  ],
  ['Menu: $35 for 30 days or $150 lifetime. UGC: $30 for 30 days, $60 for 90 days, or $150 lifetime', `Menu: ${MENU.replace('The menu is ', '')}. ${UGC}`],
  [
    'Menu: $35 for 30 days or $150 lifetime. UGC: $35 for 30 days, $60 for 90 days, or $150 lifetime',
    `Menu: $35 for 31 days or $150 lifetime. ${UGC}`,
  ],
  ['UGC: $30 for 30 days, $60 for 90 days, or $150 lifetime', UGC.replace('UGC is ', 'UGC: ')],
  ['UGC $30, $60, or $150', 'UGC $35 or $150'],
  ['HWID spoofer $50, $100, or $150', 'HWID spoofer $50 or $150'],
  [
    'Valorant hacks for PC: menu $35 or $150 lifetime. UGC $30, $60, or $150. HWID spoofer $50, $100, or $150. Separate checkouts.',
    `Valorant hacks for PC: ${MENU.toLowerCase()}. ${UGC.toLowerCase()}. ${SPOOFER.toLowerCase()}. Separate checkouts.`,
  ],
  ['Plans are $50 for 30 days, $100 for 90 days, or $150 lifetime', SPOOFER.replace('The HWID spoofer is ', 'Plans are ')],
  ['Monthly $50 USD (P30D), three months $100 USD (P90D), or lifetime $150 USD (P99Y).', '$50 for 31 days or $150 lifetime.'],
  ['Monthly $35 for 30 days or lifetime $150.', '$35 for 31 days or $150 lifetime.'],
  ['$60 for 90 days', '$35 for 31 days'],
  ['$100 for 90 days', '$50 for 31 days'],
  ['$30 for 30 days', '$35 for 31 days'],
  ['30 days of access · renew at checkout', '31 days of access · renew at checkout'],
  ['Start with the 30-day key', 'Start with the 31-day key'],
  [' (P90D)', ' (P31D)'],
  [' (P30D)', ' (P31D)'],
  ['90 days of access', '31 days of access'],
];

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.astro') continue;
      walk(full, acc);
    } else if (/\.(json|md|ts|mjs|astro)$/.test(name)) {
      acc.push(full);
    }
  }
  return acc;
}

const skipBasenames = new Set(['product-plans.ts', 'productPricing.ts', 'loader-pricing.ts']);

let filesTouched = 0;
for (const file of walk(src)) {
  if (skipBasenames.has(path.basename(file))) continue;
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of REPLACEMENTS) {
    if (from.length < 4) continue;
    if (text.includes(from)) {
      text = text.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, text);
    filesTouched += 1;
  }
}

console.log(`sync-product-pricing: updated ${filesTouched} files under src/`);
