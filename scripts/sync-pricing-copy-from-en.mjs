import fs from 'node:fs';
import path from 'node:path';

const i18nDir = path.join(process.cwd(), 'src', 'i18n');
const en = JSON.parse(fs.readFileSync(path.join(i18nDir, 'en.json'), 'utf8'));
const enSeo = JSON.parse(fs.readFileSync(path.join(i18nDir, 'seo', 'en.json'), 'utf8'));

const PRICING_BLOG = {
  title: 'Menu Plans: $30, $60, and $150',
  description:
    'The menu is $30 for 30 days, $60 for 90 days, or $150 lifetime. The HWID spoofer and UGC are separate cards with their own prices.',
};

const PLANS_STATUS_SUMMARY =
  'The menu and UGC are $30 for 30 days, $60 for 90 days, or $150 lifetime. The HWID spoofer is $50, $100, or $150. A lifetime key on one product does not include the others.';

const PLAN_FINDER_QUARTER =
  '$60 for a 90-day key at checkout — about 33% vs three $30 renewals';

function set(obj, keys, value) {
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] == null) return;
    cur = cur[k];
  }
  const last = keys[keys.length - 1];
  if (cur[last] != null && typeof cur[last] === 'string') cur[last] = value;
}

const stringFields = [
  ['hero', 'subtitle'],
  ['whyUs', 'subtitle'],
  ['products', 'subtitle'],
  ['productCatalog', 'searchHeading'],
  ['status', 'pageDesc'],
  ['pricing', 'subtitle'],
];

const locales = fs
  .readdirSync(i18nDir)
  .filter((n) => n.endsWith('.json') && n !== 'en.json' && n !== 'glossary.json');

for (const file of locales) {
  const p = path.join(i18nDir, file);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  let changed = false;

  for (const keys of stringFields) {
    const enVal = keys.reduce((o, k) => o?.[k], en);
    if (typeof enVal !== 'string' || !enVal.includes('$60')) continue;
    const locVal = keys.reduce((o, k) => o?.[k], data);
    if (typeof locVal !== 'string') continue;
    if (!locVal.includes('$60') || locVal.includes('$35')) {
      set(data, keys, enVal);
      changed = true;
    }
  }

  if (Array.isArray(data.faq?.items) && Array.isArray(en.faq?.items)) {
    for (let i = 0; i < data.faq.items.length && i < en.faq.items.length; i++) {
      const enA = en.faq.items[i]?.a;
      const locA = data.faq.items[i]?.a;
      if (typeof enA === 'string' && enA.includes('$60') && typeof locA === 'string') {
        if (!locA.includes('$60') || locA.includes('$35')) {
          data.faq.items[i].a = enA;
          if (en.faq.items[i].aHtml) data.faq.items[i].aHtml = en.faq.items[i].aHtml;
          changed = true;
        }
      }
    }
  }

  if (data.about?.sections && en.about?.sections) {
    for (let i = 0; i < data.about.sections.length && i < en.about.sections.length; i++) {
      const enParas = en.about.sections[i]?.paragraphs;
      const locParas = data.about.sections[i]?.paragraphs;
      if (!Array.isArray(enParas) || !Array.isArray(locParas)) continue;
      for (let j = 0; j < locParas.length && j < enParas.length; j++) {
        if (
          typeof enParas[j] === 'string' &&
          enParas[j].includes('$60') &&
          typeof locParas[j] === 'string' &&
          (!locParas[j].includes('$60') || locParas[j].includes('$35'))
        ) {
          data.about.sections[i].paragraphs[j] = enParas[j];
          changed = true;
        }
      }
    }
  }

  if (data.legal?.terms?.sections && en.legal?.terms?.sections) {
    for (let i = 0; i < data.legal.terms.sections.length && i < en.legal.terms.sections.length; i++) {
      const enParas = en.legal.terms.sections[i]?.paragraphs;
      const locParas = data.legal.terms.sections[i]?.paragraphs;
      if (!Array.isArray(enParas) || !Array.isArray(locParas)) continue;
      for (let j = 0; j < locParas.length && j < enParas.length; j++) {
        if (
          typeof enParas[j] === 'string' &&
          enParas[j].includes('$60') &&
          typeof locParas[j] === 'string' &&
          (!locParas[j].includes('$60') || locParas[j].includes('$35'))
        ) {
          data.legal.terms.sections[i].paragraphs[j] = enParas[j];
          changed = true;
        }
      }
    }
  }

  if (data.status?.updates && en.status?.updates) {
    for (const upd of data.status.updates) {
      if (typeof upd.summary === 'string' && (upd.summary.includes('$35') || !upd.summary.includes('$60'))) {
        const enUpd = en.status.updates.find((u) => u.id === upd.id);
        if (enUpd?.summary?.includes('$60')) {
          upd.summary = enUpd.summary;
          changed = true;
        }
      }
    }
  }

  if (data.explore?.cards) {
    const plansCard = data.explore.cards.find((c) => c.href?.includes('products'));
    const enPlans = en.explore?.cards?.find((c) => c.href?.includes('products'));
    if (plansCard?.desc && enPlans?.desc?.includes('$60')) {
      if (!plansCard.desc.includes('$60') || plansCard.desc.includes('$35')) {
        plansCard.desc = enPlans.desc;
        changed = true;
      }
    }
  }

  if (data.blogSidebar?.planFinderQuarterNote) {
    const note = data.blogSidebar.planFinderQuarterNote;
    if (
      note.includes('$35') ||
      !note.includes('$60') ||
      /\$30,\s*\$60,\s*or\s*\$150.*30.day/i.test(note)
    ) {
      const dash = note.includes('—') ? '—' : note.includes('–') ? '–' : note.includes(' - ') ? ' - ' : null;
      const suffix = dash ? note.split(dash).slice(1).join(dash).trim() : '';
      data.blogSidebar.planFinderQuarterNote = suffix
        ? `${PLAN_FINDER_QUARTER} ${dash} ${suffix}`
        : PLAN_FINDER_QUARTER;
      changed = true;
    }
  }

  if (changed) fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}

for (const name of fs.readdirSync(path.join(i18nDir, 'seo'))) {
  if (!name.endsWith('.json') || name === 'en.json') continue;
  const file = path.join(i18nDir, 'seo', name);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!data.pages) continue;
  if (data.pages['/blog/dayz-cheats-pricing/']) {
    data.pages['/blog/dayz-cheats-pricing/'] = { ...PRICING_BLOG };
  }
  if (data.pages['/blog/valorant-cheats-pricing/']) {
    data.pages['/blog/valorant-cheats-pricing/'] = { ...PRICING_BLOG };
  }
  for (const [pagePath, entry] of Object.entries(data.pages)) {
    if (typeof entry?.description === 'string') {
      const enDesc = enSeo.pages?.[pagePath]?.description;
      if (
        enDesc?.includes('$60') &&
        (!entry.description.includes('$60') ||
          entry.description.includes('$35') ||
          /\$30 monthly/i.test(entry.description))
      ) {
        entry.description = enDesc;
      }
    }
    if (typeof entry?.title === 'string') {
      const enTitle = enSeo.pages?.[pagePath]?.title;
      if (
        enTitle &&
        (entry.title.includes('$35') ||
          (/\$30 monthly/i.test(entry.title) && !entry.title.includes('$60')))
      ) {
        entry.title = enTitle.includes('$60') ? enTitle : entry.title.replace(/\$35/g, '$30');
      }
    }
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

function syncPricingStrings(enNode, locNode) {
  if (enNode == null || locNode == null) return locNode;
  if (typeof enNode === 'string' && typeof locNode === 'string') {
    const enHasPricing =
      enNode.includes('$60') ||
      (enNode.includes('$30') && enNode.includes('$150')) ||
      (enNode.includes('$50') && enNode.includes('$100') && enNode.includes('$150'));
    const locBad =
      locNode.includes('$35') ||
      locNode.includes('P31D') ||
      locNode.includes('P99Y') ||
      (enHasPricing && enNode.includes('$60') && !locNode.includes('$60')) ||
      (enNode.includes('$100') && locNode.includes('$50') && !locNode.includes('$100'));
    if (enHasPricing && locBad) return enNode;
    return locNode;
  }
  if (Array.isArray(enNode) && Array.isArray(locNode)) {
    for (let i = 0; i < locNode.length; i++) {
      if (enNode[i] !== undefined) locNode[i] = syncPricingStrings(enNode[i], locNode[i]);
    }
    return locNode;
  }
  if (typeof enNode === 'object' && typeof locNode === 'object') {
    for (const key of Object.keys(locNode)) {
      if (enNode[key] !== undefined) locNode[key] = syncPricingStrings(enNode[key], locNode[key]);
    }
  }
  return locNode;
}

for (const file of locales) {
  const p = path.join(i18nDir, file);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const merged = syncPricingStrings(en, data);
  if (Array.isArray(merged.status?.updates)) {
    for (const entry of merged.status.updates) {
      if (entry?.id === 'plans' && typeof entry.summary === 'string') {
        entry.summary = PLANS_STATUS_SUMMARY;
      }
    }
  }
  if (merged.blogSidebar?.planFinderQuarterNote) {
    const note = merged.blogSidebar.planFinderQuarterNote;
    if (
      note.includes('$35') ||
      !note.includes('$60') ||
      /\$30,\s*\$60,\s*or\s*\$150.*30.day/i.test(note)
    ) {
      const dash = note.includes('—') ? '—' : note.includes('–') ? '–' : null;
      const suffix = dash ? note.split(dash).slice(1).join(dash).trim() : '';
      merged.blogSidebar.planFinderQuarterNote = suffix
        ? `${PLAN_FINDER_QUARTER} ${dash} ${suffix}`
        : PLAN_FINDER_QUARTER;
    }
  }
  fs.writeFileSync(p, JSON.stringify(merged, null, 2) + '\n');
}

const productDir = path.join(i18nDir, 'product');
const productEn = JSON.parse(fs.readFileSync(path.join(productDir, 'en.json'), 'utf8'));
for (const name of fs.readdirSync(productDir)) {
  if (!name.endsWith('.json') || name === 'en.json') continue;
  const file = path.join(productDir, name);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  fs.writeFileSync(file, JSON.stringify(syncPricingStrings(productEn, data), null, 2) + '\n');
}

const PRICING_BLOG_PATHS = new Set([
  '/blog/dayz-cheats-pricing/',
  '/blog/valorant-cheats-pricing/',
  '/blog/best-dayz-cheats-2026/',
]);

function seoNeedsThreeTier(entry) {
  if (!entry) return false;
  const blob = `${entry.title ?? ''}\n${entry.description ?? ''}`;
  return (
    blob.includes('$35') ||
    (/\$30 monthly/i.test(blob) && !blob.includes('$60')) ||
    (/\$30[,\s].*\$150/i.test(blob) && !blob.includes('$60'))
  );
}

// SEO: any page description/title with $35 or two-tier menu pricing
for (const name of fs.readdirSync(path.join(i18nDir, 'seo'))) {
  if (!name.endsWith('.json') || name === 'en.json') continue;
  const file = path.join(i18nDir, 'seo', name);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!data.pages) continue;
  if (data.pages) data.pages = syncPricingStrings(enSeo.pages, data.pages);
  for (const [pagePath, entry] of Object.entries(data.pages)) {
    if (PRICING_BLOG_PATHS.has(pagePath)) {
      data.pages[pagePath] = { ...PRICING_BLOG };
      continue;
    }
    if (!seoNeedsThreeTier(entry)) continue;
    const enEntry = enSeo.pages[pagePath];
    if (enEntry && (enEntry.title || enEntry.description)) {
      if (enEntry.title && seoNeedsThreeTier({ title: entry.title })) entry.title = enEntry.title;
      if (enEntry.description) entry.description = enEntry.description;
    } else if (pagePath.includes('pricing') || pagePath.includes('cheats-2026')) {
      data.pages[pagePath] = { ...PRICING_BLOG };
    } else if (entry.description && seoNeedsThreeTier({ description: entry.description })) {
      entry.description = PRICING_BLOG.description;
    }
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

console.log('Synced pricing strings from en.json and fixed locale SEO blog pricing.');
