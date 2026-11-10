import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'src', 'i18n');

const textReplacements = [
  ['Monthly $50 USD, three months $100 USD, or lifetime $150 USD.', '$50 for 31 days or $150 lifetime.'],
  ['Monthly $30 USD, three months $60 USD, or lifetime $150 USD.', '$35 for 31 days or $150 lifetime.'],
];

const quarterNote =
  'No 90-day plan — use 31 days or lifetime at checkout';

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.json')) {
      let text = fs.readFileSync(full, 'utf8');
      let changed = false;
      for (const [from, to] of textReplacements) {
        if (text.includes(from)) {
          text = text.split(from).join(to);
          changed = true;
        }
      }
      if (text.includes('planFinderQuarterNote')) {
        const next = text.replace(
          /"planFinderQuarterNote": "[^"]*"/g,
          `"planFinderQuarterNote": "${quarterNote}"`,
        );
        if (next !== text) {
          text = next;
          changed = true;
        }
      }
      if (changed) fs.writeFileSync(full, text);
    }
  }
}

walk(root);
console.log('scrub-stale-pricing-json: done');
