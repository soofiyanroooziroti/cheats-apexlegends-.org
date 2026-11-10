/**
 * Regenerate public/_redirects from scripts/redirects.mjs + checkout-redirects.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PATH_REDIRECTS } from './redirects.mjs';
import { CHECKOUT_PATH_REDIRECTS } from '../src/config/checkout-redirects.mjs';
import { nonDefaultShipLocales } from './locale-ship.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', '_redirects');

const lines = [];

lines.push('# Checkout → Zadeyo (302 at edge; Buy buttons use full Zadeyo URLs in HTML)');
for (const [from, to] of CHECKOUT_PATH_REDIRECTS) {
  lines.push(`${from} ${to} 302`);
}

lines.push('');
lines.push('# Localized /{locale}/go/* → /go/* (no SSR middleware on Workers static assets)');
for (const locale of nonDefaultShipLocales) {
  lines.push(`/${locale}/go/* /go/:splat 302`);
}

lines.push('');
lines.push('# Retired locale prefixes (no longer shipped)');
for (const legacy of ['it', 'cs', 'pl']) {
  lines.push(`/${legacy}/* / 301`);
}

lines.push('');
lines.push('# Legacy paths');
for (const [from, to] of PATH_REDIRECTS) {
  lines.push(`${from} ${to} 301`);
}

fs.writeFileSync(out, `${lines.join('\n')}\n`);
console.log(`Wrote ${lines.length} lines → public/_redirects`);
