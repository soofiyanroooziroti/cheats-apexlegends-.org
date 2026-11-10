/**
 * Loader = $35 / $150 only. Rewrites stale three-tier menu copy across src/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');

const REPLACEMENTS = [
  [
    'The menu is $30 for 30 days, $60 for 90 days, or $150 lifetime',
    'The menu is $35 for 30 days or $150 lifetime',
  ],
  [
    'The menu and UGC are $30 for 30 days, $60 for 90 days, or $150 lifetime',
    'The menu is $35 for 30 days or $150 lifetime. UGC is $30 for 30 days, $60 for 90 days, or $150 lifetime',
  ],
  ['The menu is $30, $60, or $150', 'The menu is $35 or $150'],
  ['menu is $30, $60, or $150', 'menu is $35 or $150'],
  ['Monthly is $30. Three months is $60. Lifetime is $150.', 'Monthly is $35. Lifetime is $150.'],
  ['Monthly, three months, and lifetime unlock the same loader.', 'Monthly and lifetime unlock the same loader.'],
  [
    'Monthly is $30 for 30 days. Three months is $60. Lifetime is $150 if you keep playing.',
    'Monthly is $35 for 30 days. Lifetime is $150 if you keep playing.',
  ],
  [
    'Monthly is $30 for 30 days. Three months is $60 and saves about 33% compared with three monthly renewals. Lifetime is $150 once. Five monthly renewals at $30 equal $150.',
    'Monthly is $35 for 30 days. Lifetime is $150 once. About four monthly renewals at $35 equal lifetime.',
  ],
  ['$30, $60, or $150', '$35 or $150'],
  ['$30, $60, and $150', '$35 and $150'],
  ['$30 / $60 / $150', '$35 / $150'],
  ['Menu and UGC: $30 for 30 days, $60 for 90 days, or $150 lifetime', 'Menu: $35 for 30 days or $150 lifetime. UGC: $30 for 30 days, $60 for 90 days, or $150 lifetime'],
  ['The menu or UGC: $30, $60, or $150', 'The menu: $35 or $150. UGC: $30, $60, or $150'],
  [
    'Prices are $30 for 30 days, $60 for 90 days, and $150 lifetime.',
    'Prices are $35 for 30 days and $150 lifetime.',
  ],
  ['Four menu groups: Aimbot Options, Player Visual Options, World Visual Options, and Misc Options. $30, $60, or $150.', 'Four menu groups: Aimbot Options, Player Visual Options, World Visual Options, and Misc Options. $35 or $150.'],
  [
    'Valorant hacks for PC: $30 for 30 days, $60 for 90 days, and $150 lifetime. Menu, HWID spoofer, and UGC are separate checkouts.',
    'Valorant hacks for PC: menu $35 or $150 lifetime. UGC $30, $60, or $150. HWID spoofer $50, $100, or $150. Separate checkouts.',
  ],
  [
    'Compare Valorant Cheats on Windows: ESP modules, aimbot settings, $30, $60, and $150 plans, the live Status label, and setup notes before you load.',
    'Compare Valorant Cheats on Windows: aimbot and visual options, menu plans $35 and $150, the live Status label, and setup notes before you load.',
  ],
  ['The $30 or $50 you already paid', 'The $35 or $50 you already paid'],
  [
    'their own $30, $60, and $150 (or $50, $100, and $150) plans',
    'their own $35 and $150 (menu), $30, $60, and $150 (UGC), or $50, $100, and $150 (spoofer) plans',
  ],
  ['Monthly $30 USD (P30D), three months $60 USD (P90D), or lifetime $150 USD (P99Y).', 'Monthly $35 for 30 days or lifetime $150.'],
  ['Compare 30 days, 90 days, and lifetime on each product card.', 'Compare $35 and $150 on the menu; other products have their own plans.'],
  ['Monthly is $30 for 30 days. Three months is $60.', 'Monthly is $35 for 30 days.'],
  ['Three months is $60. Lifetime is $150.', 'Lifetime is $150.'],
  [
    'Monthly is $30 for 30 days. Three months is $60. Lifetime is $150.',
    'The menu is $35 for 30 days or $150 lifetime.',
  ],
  ['Klucz wspomagania oraz UGC są dostępne jako $30 for 30 days, $60 for 90 days, or $150 lifetime.', 'The menu is $35 for 30 days or $150 lifetime. UGC is $30 for 30 days, $60 for 90 days, or $150 lifetime.'],
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

let filesTouched = 0;
for (const file of walk(src)) {
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of REPLACEMENTS) {
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

console.log(`sync-loader-pricing: updated ${filesTouched} files under src/`);
