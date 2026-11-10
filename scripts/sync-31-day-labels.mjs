/**
 * Short plan is always 31 days in UI copy — never 30 days or "1 Month".
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');

const REPLACEMENTS = [
  ['Monthly is $35 for 30 days', 'The 31-day plan is $35'],
  ['Monthly is $35 for 31 days', 'The 31-day plan is $35'],
  ['Monthly is $35.', 'The 31-day plan is $35.'],
  ['Monthly is $35', 'The 31-day plan is $35'],
  ['four monthly renewals', 'four 31-day renewals'],
  ['Monthly and lifetime', '31-day and lifetime'],
  ['compare monthly', 'compare 31-day'],
  ['Compare monthly', 'Compare 31-day'],
  ['monthly and lifetime', '31-day and lifetime'],
  ['monthly i lifetime', '31-day i lifetime'],
  ['monthly e lifetime', '31-day e lifetime'],
  ['monthly et lifetime', '31-day et lifetime'],
  ['monthly und lifetime', '31-day und lifetime'],
  ['monthly es lifetime', '31-day es lifetime'],
  ['monthly составляет', '31-day plan'],
  ['monthly kosztuje', '31-day plan'],
  ['monthly del cheat', '31-day plan del cheat'],
  ['monthly spoofera', '31-day spoofer plan'],
  ['monthly wynosi', '31-day plan wynosi'],
  ['monthly спуфера', '31-day spoofer plan'],
  ['1 Month', '31 days'],
  ['30 days', '31 days'],
  ['30-day', '31-day'],
  ['30 dni', '31 dni'],
  ['30 dias', '31 dias'],
  ['30 días', '31 días'],
  ['30 jours', '31 jours'],
  ['30 Tage', '31 Tage'],
  ['30 giorni', '31 giorni'],
  ['30 天', '31 天'],
  ['30 日間', '31 日間'],
  ['30 dias ·', '31 dias ·'],
  ['30 dni ·', '31 dni ·'],
  ['30 jours ·', '31 jours ·'],
  ['30 Tage ·', '31 Tage ·'],
  ['"planFinderRecommendMonthly": "Monthly"', '"planFinderRecommendMonthly": "31-day plan"'],
  ['"monthlySuffix": " monthly"', '"monthlySuffix": ""'],
  ['Plans Monthly', 'Plans: 31-day'],
  ['Monthly ·', '31 days ·'],
  ['Monthly oraz', '31-day oraz'],
  ['Monthly- und', '31-day- und'],
  ['Monthly und', '31-day und'],
  ['Monthly y', '31-day y'],
  ['Monthly e', '31-day e'],
  ['Monthly och', '31-day och'],
  ['Misc Options.  for 31 days or  lifetime.', 'Misc Options. $35 for 31 days or $150 lifetime.'],
  ['compare monthly', 'compare 31-day'],
  ['Compare monthly', 'Compare 31-day'],
  ['monthly et lifetime', '31-day et lifetime'],
  ['monthly und lifetime', '31-day und lifetime'],
  ['monthly y lifetime', '31-day y lifetime'],
  ['monthly i lifetime', '31-day i lifetime'],
  ['monthly и lifetime', '31-day и lifetime'],
  ['monthlyとlifetime', '31-dayとlifetime'],
  ['Monthly ', '31-day '],
  [' monthly', ' 31-day'],
  ['Monthly et', '31-day et'],
  ['Monthly und', '31-day und'],
  ['Monthlyおよび', '31-dayおよび'],
  ['Plany Monthly', 'Plany 31-day'],
  ['Планы Monthly', 'Планы 31-day'],
  ['O monthly do', 'Plano de 31 dias do'],
  ['Il cheat e UGC monthly', 'Menu e UGC:'],
  ['El cheat y el UGC monthly', 'Menu y UGC:'],
  ['Le cheat et UGC monthly', 'Menu et UGC:'],
  ['Le monthly du spoofer', 'Le plan 31 jours du spoofer'],
  ['Lo spoofer monthly', 'Spoofer 31 giorni'],
  ['spoofer monthly', 'spoofer 31-day'],
  ['UGC monthly', 'UGC 31-day'],
  ['cheat monthly', 'menu 31-day'],
  ['loader monthly', 'menu 31-day'],
];

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.astro') continue;
      walk(full, acc);
    } else if (/\.json$/.test(name)) {
      acc.push(full);
    }
  }
  return acc;
}

let n = 0;
for (const file of walk(src)) {
  if (file.includes('sync-31-day-labels')) continue;
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
    n += 1;
  }
}

console.log(`sync-31-day-labels: updated ${n} files`);
