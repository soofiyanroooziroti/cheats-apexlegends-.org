/**
 * Pull logo.webp from valcheats.com.zip (or brand-incoming/) into brand-incoming/logo.webp.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const zipPath = path.join(root, 'valcheats.com.zip');
const outDir = path.join(root, 'brand-incoming');
const outWebp = path.join(outDir, 'logo.webp');
const entry = 'valcheats.com/media/logo.webp';

if (!fs.existsSync(zipPath)) {
  if (fs.existsSync(outWebp)) {
    console.log('install-brand-from-zip: using existing brand-incoming/logo.webp');
    process.exit(0);
  }
  console.error('Missing valcheats.com.zip and brand-incoming/logo.webp');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const extractDir = path.join(root, '_zip_extract_valcheats');
fs.mkdirSync(extractDir, { recursive: true });
execFileSync('tar', ['-xf', zipPath, '-C', extractDir], { stdio: 'inherit' });

const extracted = path.join(extractDir, entry);
if (!fs.existsSync(extracted)) {
  console.error(`Missing ${entry} inside zip`);
  process.exit(1);
}

fs.copyFileSync(extracted, outWebp);
console.log(`install-brand-from-zip: wrote ${path.relative(root, outWebp)}`);
