import fs from 'node:fs';
import path from 'node:path';

const srcRoot = path.join(process.cwd(), 'src');

/** Menu + UGC: $30 / $60 / $150. HWID: $50 / $100 / $150. */
const MENU_PLANS = '$30 for 30 days, $60 for 90 days, or $150 lifetime';
const MENU_PLANS_SHORT = '$30, $60, or $150';
const MENU_PLANS_AND = '$30, $60, and $150';
const SPOOFER_PLANS = '$50, $100, or $150';
const SPOOFER_PLANS_AND = '$50, $100, and $150';

const pairs = [
  // Broken duplicates from partial earlier fixes
  ['$30, $60, or $150 or $150 lifetime', MENU_PLANS_SHORT],
  ['$30, $60, or $150 o $150 lifetime', MENU_PLANS_SHORT],
  ['$30, $60, or $150 ou $150 lifetime', MENU_PLANS_SHORT],
  ['$30, $60, or $150 или $150 lifetime', MENU_PLANS_SHORT],
  ['$30, $60 o $150 lifetime', MENU_PLANS_SHORT],
  ['$30, $60 et $150 lifetime', MENU_PLANS_SHORT],

  // Old Warzone $35 / 31-day
  ['$35 for 31 days', MENU_PLANS],
  ['$35 for 30 days', MENU_PLANS],
  ['$35 por 31 dias', MENU_PLANS],
  ['$35 por 31 días', MENU_PLANS],
  ['$35 na 31 dzień', MENU_PLANS],
  ['$35 na 31 dni', MENU_PLANS],
  ['$35 на 31 день', MENU_PLANS],
  ['$35/mo', MENU_PLANS_SHORT],
  ['$35 / $150', '$30 / $60 / $150'],
  ['$35 monthly', '$30 monthly'],
  ['pour $35', 'for $30, $60, or $150'],
  ['sind $35', 'are $30, $60, or $150'],
  ['sont $35', 'are $30, $60, or $150'],
  ['están $35', 'are $30, $60, or $150'],
  ['son $35', 'are $30, $60, or $150'],
  ['costano $35', 'cost $30, $60, or $150'],
  ['$35 pour', '$30, $60, or $150 for'],
  ['$35 per', '$30, $60, or $150 per'],
  ['$35 por', '$30, $60, or $150 por'],
  ['$35 за', '$30, $60, or $150 за'],
  ['$35で', '$30, $60, or $150で'],
  ['$35 checkout', '$30, $60, or $150 checkout'],
  ['monthly is $35', 'monthly is $30; three months is $60'],
  ['monthly составляет $35', 'monthly is $30; three months is $60'],
  ['monthly wynosi $35', 'monthly is $30; three months is $60'],
  ['monthly价格为 $35', 'monthly is $30; three months is $60'],
  ['31-day', '30-day'],
  ['31 days', '30 days'],
  ['31 días', '30 días'],
  ['31 dias', '30 dias'],
  ['31 dni', '30 dni'],
  ['31 дней', '30 дней'],
  ['31 dagen', '30 dagen'],
  ['31 jours', '30 jours'],
  ['31-Tage', '30-Tage'],
  ['31d', '30d'],

  // Two-tier menu copy → three-tier
  ['$30 monthly or $150 lifetime', MENU_PLANS],
  ['$30 monthly and $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly versus $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly vs $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly contre $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly kontra $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly contro $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly et $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly y $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly und $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly ou $150 lifetime', MENU_PLANS],
  ['$30 monthly или $150 lifetime', MENU_PLANS],
  ['$30 monthly och $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly i $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly a $150 lifetime', MENU_PLANS],
  ['$30 monthly e $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly と $150 lifetime', MENU_PLANS_AND],
  ['share $30 monthly and $150 lifetime', `share ${MENU_PLANS_AND}`],
  ['teilen sich $30 monthly und $150 lifetime', `teilen sich ${MENU_PLANS_AND}`],
  ['compartilham $30 monthly e $150 lifetime', `compartilham ${MENU_PLANS_AND}`],
  ['dzielą $30 monthly i $150 lifetime', `dzielí ${MENU_PLANS_AND}`],
  ['partagent $30, $60, and $150', `partagent ${MENU_PLANS_AND}`],

  // Two-tier spoofer → three-tier
  ['$50 monthly or $150 lifetime', SPOOFER_PLANS],
  ['$50 monthly and $150 lifetime', SPOOFER_PLANS_AND],
  ['$50 monthly ou $150 lifetime', SPOOFER_PLANS],
  ['$50 monthly или $150 lifetime', SPOOFER_PLANS],
  ['$50 monthly oder $150 lifetime', SPOOFER_PLANS],
  ['$50/mo or $150 lifetime', SPOOFER_PLANS],
  ['$50/mo ou $150 lifetime', SPOOFER_PLANS],
  ['$50/mo o $150 lifetime', SPOOFER_PLANS],
  ['$50/mo oder $150 lifetime', SPOOFER_PLANS],
  ['$50/mese o $150 lifetime', SPOOFER_PLANS],
  ['$50/mese o $150', SPOOFER_PLANS],
  ['HWID spoofer $50/mese o $150 lifetime', `HWID spoofer ${SPOOFER_PLANS}`],
  ['HWID spoofer: $50/mo or $150 lifetime', `HWID spoofer: ${SPOOFER_PLANS}`],

  // Loader lines missing $60 (common SEO)
  ['Monthly ist für 30 Tage $35. Lifetime ist $150.', `Menu and UGC: ${MENU_PLANS_SHORT}. Lifetime is $150 per product.`],
  ['Monthly ist für 30 Tage $30. Lifetime ist $150.', `Monthly is $30 for 30 days. Three months is $60. Lifetime is $150.`],
  ['Monthly est $35 pendant 30 jours. Lifetime est $150.', `Monthly is $30 for 30 days. Three months is $60. Lifetime is $150.`],
  ['Monthly está $30 durante 30 días. Lifetime es $150.', `Monthly is $30 for 30 days. Three months is $60. Lifetime es $150.`],
  ['Monthly è $30 per 30 giorni. Lifetime è $150.', `Monthly is $30 for 30 days. Three months is $60. Lifetime is $150.`],
  ['Monthly jest $30 przez 30 dni. Lifetime jest $150.', `Monthly is $30 for 30 days. Three months is $60. Lifetime is $150.`],
  ['Monthly je $35 na 30 dní. Lifetime je $150.', `Monthly is $30 for 30 days. Three months is $60. Lifetime is $150.`],
  ['Monthly является $35 на 30 дней. Lifetime является $150.', `Monthly is $30 for 30 days. Three months is $60. Lifetime is $150.`],
  ['Monthly は 30 日間 $35 です。Lifetime は $150 です。', `Monthly is $30 for 30 days. Three months is $60. Lifetime is $150.`],
  ['Monthly is $35', 'Monthly is $30 for 30 days. Three months is $60'],
  ['Monthly è $35', 'Monthly is $30 for 30 days. Three months is $60'],
  ['Monthly ist $35', 'Monthly is $30 for 30 days. Three months is $60'],
  ['Monthly jest $35', 'Monthly is $30 for 30 days. Three months is $60'],
  ['Monthly é $35', 'Monthly is $30 for 30 days. Three months is $60'],
  ['Monthly está $35', 'Monthly is $30 for 30 days. Three months is $60'],
  ['Monthly は $35', 'Monthly is $30 for 30 days. Three months is $60'],

  // Blog / compare titles (English fragments in locale SEO)
  ['Monthly $35 vs Lifetime $150', 'Plans: $30, $60, and $150'],
  ['Monthly $30 vs Lifetime $150', 'Plans: $30, $60, and $150'],
  ['Compare 30-day access at $35 with the $150', 'Compare $30, $60, and $150 plans. The $150'],
  ['Compare 31-day access at $35 with the $150', 'Compare $30, $60, and $150 plans. The $150'],
  ['access at $35 with the $150 long-term', 'access at $30, $60, and $150. The $150 long-term'],
  ['31 días a $35 con la clave', '30 días a $30, 90 días a $60, o la clave'],
  ['31 giorni a $35 con la chiave', '30 giorni a $30, 90 giorni a $60, o la chiave'],
  ['31 jours à $35 avec la clé', '30 jours à $30, 90 jours à $60, ou la clé'],
  ['31-Tage-Zugang zu $35 mit dem $150', 'Pläne: $30, $60 und $150. Der $150'],
  ['31 dni za $35', '$30, $60 lub $150'],
  ['31 дней по цене $35', '$30, $60 или $150'],
  ['cheat e UGC $30, $60 o $150 lifetime', `menu and UGC ${MENU_PLANS}`],
  ['cheat e UGC $30, $60, or $150 lifetime', `menu and UGC ${MENU_PLANS}`],

  // Status / summary lines
  ['loader and UGC monthly is $35', `menu and UGC are ${MENU_PLANS_SHORT}`],
  ['loader and UGC monthly is $30', `menu and UGC are ${MENU_PLANS_SHORT}`],
  ['loader monthly is $35', 'loader monthly is $30'],
  ['cheat and UGC monthly is $35', `menu and UGC are ${MENU_PLANS_SHORT}`],
  ['UGC monthly is $35', `menu and UGC are ${MENU_PLANS_SHORT}`],
  ['monthly prices is $35', `monthly is $30; three months is $60`],
  ['monthly is $35', 'monthly is $30; three months is $60'],

  // Plan finder quarter note (all locales → English pricing truth)
  ['$35 per 31-day key at checkout', '$60 for a 90-day key at checkout'],
  ['$35 pro 31-Tage-Schlüssel beim Checkout', '$60 for a 90-day key at checkout'],
  ['$35 par clé de 31 jours lors du paiement', '$60 for a 90-day key at checkout'],
  ['$35 por clave de 31 días al pagar', '$60 for a 90-day key at checkout'],
  ['$35 per chiave da 31 giorni al checkout', '$60 for a 90-day key at checkout'],
  ['$35 za klucz na 31 dni przy kasie', '$60 for a 90-day key at checkout'],
  ['$35 за ключ на 31 день при оформлении', '$60 for a 90-day key at checkout'],
  ['$35 por chave de 31 dias no checkout', '$60 for a 90-day key at checkout'],
  ['チェックアウト時に31日用キーあたり $35', '$60 for a 90-day key at checkout'],
  ['结账时每 31 天密匙 $35', '$60 for a 90-day key at checkout'],
  ['$35 za 30denní klíč při pokladně', '$60 for a 90-day key at checkout'],
  ['$35 pro 30-Tage-Schlüssel beim Checkout', '$60 for a 90-day key at checkout'],
  ['$35 par clé de 30 jours lors du paiement', '$60 for a 90-day key at checkout'],
  ['$35 za klucz na 30 dni przy kasie', '$60 for a 90-day key at checkout'],
  [
    '$30, $60, or $150 por clave de 30 días',
    '$60 for a 90-day key at checkout',
  ],
  [
    '$30, $60, or $150 por chave de 30 dias',
    '$60 for a 90-day key at checkout',
  ],
  ['$30 monthly 与 $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly 対 $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly против $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly proti $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly vs $150 lifetime', MENU_PLANS_AND],
  ['$30 monthly versus $150 lifetime', MENU_PLANS_AND],
  ['50 USD/mo lub $150 lifetime', '$50, $100, or $150'],
  ['50 USD na 30 dni lub $150 lifetime', '$50 for 30 days, $100 for 90 days, or $150 lifetime'],
  ['31-dniow', '30-dniow'],
  ['klucz 31-dniowy', 'klucz 30-dniowy'],
  ['$30, $60, or $150 lub $150 lifetime', MENU_PLANS],
  ['Monthly $50 USD (P31D) ou lifetime $150 USD (P99Y).', 'Monthly $50 USD, three months $100 USD, or lifetime $150 USD.'],
  ['Monthly $50 USD (P31D) o lifetime $150 USD (P99Y).', 'Monthly $50 USD, three months $100 USD, or lifetime $150 USD.'],
  ['Monthly $50 USD (P31D) oder lifetime $150 USD (P99Y).', 'Monthly $50 USD, three months $100 USD, or lifetime $150 USD.'],
  ['Monthly $50 USD (P31D) lub lifetime $150 USD (P99Y).', 'Monthly $50 USD, three months $100 USD, or lifetime $150 USD.'],
  ['Monthly $50 USD (P31D) или lifetime $150 USD (P99Y).', 'Monthly $50 USD, three months $100 USD, or lifetime $150 USD.'],
  ['Monthly $50 USD (P31D) nebo lifetime $150 USD (P99Y).', 'Monthly $50 USD, three months $100 USD, or lifetime $150 USD.'],
  ['Monthly $50 USD (P31D) または lifetime $150 USD (P99Y)。', 'Monthly $50 USD, three months $100 USD, or lifetime $150 USD.'],
  ['Monthly $50 USD（P31D）或 lifetime $150 USD（P99Y）。', 'Monthly $50 USD, three months $100 USD, or lifetime $150 USD.'],
  ['50 $ USD par mois (P31D) ou 150 $ USD à vie (P99Y).', 'Monthly $50 USD, three months $100 USD, or lifetime $150 USD.'],
];

const SEO_SYNC_PATHS = [
  '/',
  '/products/apex-cheats/',
  '/products/apex-cheats/loader/',
  '/products/apex-cheats/hwid-spoofer/',
  '/products/apex-cheats/utilities/',
  '/faq/',
  '/forum/',
  '/blog/',
];

const MENU_PHRASE = '$30 for 30 days, $60 for 90 days, or $150 lifetime';

function applyPairs(text) {
  let out = text;
  for (const [from, to] of pairs) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  // Fix repeated insertions from earlier bad replacements
  out = out.replace(
    /\$30 for 30 days, \$60 for 90 days,[\s,]*(?:\$60 for 90 days,[\s,]*)+or \$150 lifetime/g,
    MENU_PHRASE,
  );
  out = out.replace(
    /\$30 for 30 days, \$60 for 90 days, or \$150 lifetime(?:\s+(?:lub|ou|oder|o)\s+\$150 lifetime)+/gi,
    MENU_PHRASE,
  );
  out = out.replace(/or \$150 lifetime or \$150 lifetime/gi, 'or $150 lifetime');
  return out;
}

function walkAndFix(dir, acc) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules') continue;
      walkAndFix(full, acc);
      continue;
    }
    if (!/\.(json|md)$/.test(ent.name)) continue;
    if (full.includes(`${path.sep}forum${path.sep}`)) continue;
    let text = fs.readFileSync(full, 'utf8');
    const orig = text;
    text = applyPairs(text);
    if (text !== orig) {
      fs.writeFileSync(full, text);
      acc.push(path.relative(process.cwd(), full));
    }
  }
}

function syncSeoPricing() {
  const enPath = path.join(srcRoot, 'i18n', 'seo', 'en.json');
  const enPages = JSON.parse(fs.readFileSync(enPath, 'utf8')).pages ?? {};
  const seoDir = path.join(srcRoot, 'i18n', 'seo');
  const synced = [];

  for (const name of fs.readdirSync(seoDir)) {
    if (!name.endsWith('.json') || name === 'en.json') continue;
    const file = path.join(seoDir, name);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!data.pages) continue;
    let changed = false;

    for (const [pagePath, locEntry] of Object.entries(data.pages)) {
      const enEntry = enPages[pagePath];
      const blob = `${locEntry?.title ?? ''}\n${locEntry?.description ?? ''}`;
      const need =
        blob.includes('$35') ||
        (/\$30 monthly/i.test(blob) && !blob.includes('$60')) ||
        (/\$30[,\s].*\$150/i.test(blob) && !blob.includes('$60'));
      if (!need) continue;
      if (enEntry?.description) {
        if (enEntry.title && (!locEntry.title?.includes('$60') || locEntry.title.includes('$35'))) {
          locEntry.title = enEntry.title;
        }
        locEntry.description = enEntry.description;
        changed = true;
        continue;
      }
      if (locEntry.description) {
        locEntry.description = applyPairs(locEntry.description);
        if (locEntry.title) locEntry.title = applyPairs(locEntry.title);
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
      synced.push(name);
    }
  }
  return synced;
}

const updated = [];
walkAndFix(srcRoot, updated);
const seoSynced = syncSeoPricing();

console.log(`Patched ${updated.length} content files.`);
console.log(`Synced SEO pricing in: ${seoSynced.join(', ') || 'none'}`);
