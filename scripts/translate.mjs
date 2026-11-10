/**
 * npm run translate — Gemini translations for UI, SEO, product (incl. feature copy), forum, status page, and blog posts.
 * Requires GEMINI_API_KEY in .env (dotenv). Resumes: skips up-to-date targets.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import {
  protectContent,
  restoreContent,
  placeholdersRestored,
  scrubForbiddenClaims,
  stripCodeFences,
} from './gemini-protect.mjs';
import { translateJsonDocument } from './translate-json-chunks.mjs';
import { langName, nonDefaultShipLocales } from './locale-ship.mjs';
import localeSeoKeywords from './locale-seo-keywords.json' with { type: 'json' };

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(root, '..');
dotenv.config({ path: path.join(projectRoot, '.env') });

/** Only list models your API key actually supports — bad fallbacks hid 429 quota errors as "404 unavailable". */
const MODEL_PRIMARY = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const MODEL_FALLBACKS = (process.env.GEMINI_MODEL_FALLBACKS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
let activeModel = MODEL_PRIMARY;

/** Comma-separated keys rotate on 429; else single GEMINI_API_KEY. Use keys from different Google projects for separate quota. */
function loadApiKeys() {
  const fromList = (process.env.GEMINI_API_KEYS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromList.length) return fromList;
  const one = process.env.GEMINI_API_KEY?.trim();
  return one ? [one] : [];
}
const apiKeys = loadApiKeys();
let activeKeyIndex = 0;

function currentApiKey() {
  return apiKeys[activeKeyIndex];
}

function rotateApiKey(reason) {
  if (apiKeys.length <= 1) return false;
  const prev = activeKeyIndex;
  activeKeyIndex = (activeKeyIndex + 1) % apiKeys.length;
  if (activeKeyIndex === prev) return false;
  console.log(`translate: switching Gemini API key (${reason}) — ${activeKeyIndex + 1}/${apiKeys.length}`);
  return true;
}

const DELAY_MS = Number(process.env.TRANSLATE_DELAY_MS ?? 2500);
const FORCE = process.env.FORCE_TRANSLATE === '1';
if (process.argv.includes('--forum')) {
  process.env.TRANSLATE_KINDS = 'forum,forum-ui';
}
if (process.argv.includes('--status')) {
  process.env.TRANSLATE_KINDS = 'status-ui';
}

const LOCALES = nonDefaultShipLocales;
const LANG_NAME = langName;
const i18nEnPath = path.join(projectRoot, 'src/i18n/en.json');
const seoEnPath = path.join(projectRoot, 'src/i18n/seo/en.json');
const forumEnPath = path.join(projectRoot, 'src/i18n/forum/en.json');
const productEnPath = path.join(projectRoot, 'src/i18n/product/en.json');
const progressPath = path.join(projectRoot, '.translate-progress.json');

/** UI JSON before blogs — resume after Ctrl+C continues unfinished work first. */
const JOB_KIND_PRIORITY = {
  json: 10,
  'forum-ui': 20,
  'status-ui': 25,
  seo: 30,
  forum: 40,
  product: 50,
  blog: 100,
};

function readTranslateProgress() {
  try {
    return JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  } catch {
    return null;
  }
}

function writeTranslateProgress(job) {
  try {
    fs.writeFileSync(
      progressPath,
      `${JSON.stringify(
        {
          dest: path.relative(projectRoot, job.dest).replace(/\\/g, '/'),
          kind: job.kind,
          locale: job.locale,
          at: new Date().toISOString(),
        },
        null,
        2,
      )}\n`,
    );
  } catch {
    // non-fatal
  }
}

function sortJobsForResume(jobs) {
  const resume = readTranslateProgress();
  const resumeLocale = resume?.locale;
  return [...jobs].sort((a, b) => {
    if (resumeLocale) {
      const aR = a.locale === resumeLocale ? 0 : 1;
      const bR = b.locale === resumeLocale ? 0 : 1;
      if (aR !== bR) return aR - bR;
    }
    const pa = JOB_KIND_PRIORITY[a.kind] ?? 60;
    const pb = JOB_KIND_PRIORITY[b.kind] ?? 60;
    if (pa !== pb) return pa - pb;
    return String(a.dest).localeCompare(String(b.dest));
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isEmptyJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return true;
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return !parsed || (typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length === 0);
  } catch {
    return true;
  }
}

function readEnI18n() {
  try {
    return JSON.parse(fs.readFileSync(i18nEnPath, 'utf8'));
  } catch {
    return null;
  }
}

function readEnSeo() {
  try {
    return JSON.parse(fs.readFileSync(seoEnPath, 'utf8'));
  } catch {
    return null;
  }
}

/** Locale files still copied from English must not skip translate. */
function i18nForumUiIncomplete(dest, locale) {
  if (locale === 'en') return false;
  if (isEmptyJsonFile(dest)) return true;
  const en = readEnI18n();
  if (!en?.forum) return false;
  try {
    const parsed = JSON.parse(fs.readFileSync(dest, 'utf8'));
    const enForum = en.forum;
    const locForum = parsed?.forum;
    const enKeys = Object.keys(enForum);
    if (!locForum || typeof locForum !== 'object') return true;
    for (const key of enKeys) {
      if (!(key in locForum)) return true;
    }
    const englishCopySentinels = [
      'sortPopular',
      'exploreGuides',
      'sidebarAboutTitle',
      'replyOne',
      'noRepliesYet',
      'colThread',
      'colReplies',
      'colLastReply',
    ];
    for (const key of englishCopySentinels) {
      if (enForum[key] && locForum[key] === enForum[key]) return true;
    }
    return false;
  } catch {
    return true;
  }
}

const TRANSLATE_SKIP_KEYS = new Set([
  'id',
  'icon',
  'href',
  'slug',
  'image',
  'date',
  'dateIso',
  'featured',
  'tag',
  'domain',
  'discord',
  'num',
  'level',
  'scrollTarget',
  'ariaLabel',
]);

let protectedTermsLower = null;

function loadProtectedTermsLower() {
  if (protectedTermsLower) return protectedTermsLower;
  const file = path.join(root, 'protected-terms.json');
  try {
    const list = JSON.parse(fs.readFileSync(file, 'utf8'));
    protectedTermsLower = new Set(
      (Array.isArray(list) ? list : []).map((t) => String(t).trim().toLowerCase()).filter((t) => t.length >= 2),
    );
  } catch {
    protectedTermsLower = new Set();
  }
  return protectedTermsLower;
}

let englishModuleNamesLower = null;

function loadEnglishModuleNamesLower() {
  if (englishModuleNamesLower) return englishModuleNamesLower;
  const en = readEnI18n();
  const names = new Set();
  if (Array.isArray(en?.hero?.modes)) {
    for (const m of en.hero.modes) {
      if (typeof m === 'string') names.add(m.trim().toLowerCase());
    }
  }
  if (Array.isArray(en?.features?.items)) {
    for (const item of en.features.items) {
      if (item?.title && typeof item.title === 'string') names.add(item.title.trim().toLowerCase());
    }
  }
  englishModuleNamesLower = names;
  return names;
}

/** Only exact protected/module/path tokens may match English — not full sentences. */
function stringMayStayEnglish(value) {
  const t = String(value).trim();
  if (t.length < 3) return true;
  if (/^[\s$€£¥0-9/W.:+#?=&%·-]+$/.test(t)) return true;
  if (t.startsWith('http') || (t.startsWith('/') && !/\s/.test(t))) return true;
  if (t.includes('[[T')) return true;
  const lower = t.toLowerCase();
  if (loadProtectedTermsLower().has(lower)) return true;
  if (loadEnglishModuleNamesLower().has(lower)) return true;
  return false;
}

/** True when locale still contains untranslated English leaves (structural keys skipped). */
function hasEnglishCopy(enNode, locNode) {
  if (enNode == null || locNode == null) return enNode != null && locNode == null;
  if (typeof enNode === 'string' && typeof locNode === 'string') {
    const t = enNode.trim();
    if (t.length < 3) return false;
    if (locNode === enNode) return !stringMayStayEnglish(enNode);
    return false;
  }
  if (Array.isArray(enNode) && Array.isArray(locNode)) {
    if (locNode.length < enNode.length) return true;
    for (let i = 0; i < enNode.length; i++) {
      if (hasEnglishCopy(enNode[i], locNode[i])) return true;
    }
    return false;
  }
  if (typeof enNode === 'object' && typeof locNode === 'object') {
    for (const key of Object.keys(enNode)) {
      if (TRANSLATE_SKIP_KEYS.has(key)) continue;
      if (hasEnglishCopy(enNode[key], locNode[key])) return true;
    }
    return false;
  }
  return false;
}

function statusBundleIncomplete(dest, locale) {
  if (locale === 'en') return false;
  const en = readEnI18n();
  if (!en?.status) return false;
  if (!fs.existsSync(dest)) return true;
  try {
    const parsed = JSON.parse(fs.readFileSync(dest, 'utf8'));
    if (!parsed?.status) return true;
    return hasEnglishCopy(en.status, parsed.status);
  } catch {
    return true;
  }
}

function i18nBundleIncomplete(dest, locale) {
  if (locale === 'en') return false;
  if (isEmptyJsonFile(dest)) return true;
  const en = readEnI18n();
  if (!en) return true;
  try {
    const parsed = JSON.parse(fs.readFileSync(dest, 'utf8'));
    if (!Array.isArray(parsed?.hero?.modes) || parsed.hero.modes.length < 4) return true;
    if (!Array.isArray(parsed?.features?.items) || parsed.features.items.length < 3) return true;
    if (i18nForumUiIncomplete(dest, locale)) return true;
    return hasEnglishCopy(en, parsed);
  } catch {
    return true;
  }
}

function seoBundleIncomplete(dest, locale) {
  if (locale === 'en') return false;
  if (isEmptyJsonFile(dest)) return true;
  const en = readEnSeo();
  if (!en) return true;
  try {
    const parsed = JSON.parse(fs.readFileSync(dest, 'utf8'));
    return hasEnglishCopy(en, parsed);
  } catch {
    return true;
  }
}

function isMainI18nJson(dest) {
  return path.dirname(dest) === path.join(projectRoot, 'src/i18n');
}

function isSeoJson(dest) {
  return path.dirname(dest) === path.join(projectRoot, 'src/i18n/seo');
}

function isForumJson(dest) {
  return path.dirname(dest) === path.join(projectRoot, 'src/i18n/forum');
}

function isProductJson(dest) {
  return path.dirname(dest) === path.join(projectRoot, 'src/i18n/product');
}

function readEnProduct() {
  try {
    return JSON.parse(fs.readFileSync(productEnPath, 'utf8'));
  } catch {
    return null;
  }
}

function productBundleIncomplete(dest, locale) {
  if (locale === 'en') return false;
  if (!fs.existsSync(dest)) return true;
  const en = readEnProduct();
  if (!en?.cheats?.overview?.title) return true;
  try {
    const parsed = JSON.parse(fs.readFileSync(dest, 'utf8'));
    for (const kind of ['cheats', 'spoofer']) {
      const enSlides = en[kind]?.slides?.length ?? 0;
      const locSlides = parsed[kind]?.slides?.length ?? 0;
      if (enSlides > 0 && locSlides < enSlides) return true;
    }
    return hasEnglishCopy(en, parsed);
  } catch {
    return true;
  }
}

function readEnForum() {
  try {
    return JSON.parse(fs.readFileSync(forumEnPath, 'utf8'));
  } catch {
    return null;
  }
}

function forumBundleIncomplete(dest, locale) {
  if (locale === 'en') return false;
  if (isEmptyJsonFile(dest)) return true;
  const en = readEnForum();
  if (!en?.posts || Object.keys(en.posts).length === 0) return true;
  try {
    const parsed = JSON.parse(fs.readFileSync(dest, 'utf8'));
    for (const slug of Object.keys(en.posts)) {
      const enPost = en.posts[slug];
      const locPost = parsed?.posts?.[slug];
      if (!locPost) return true;
      // Every thread must differ from English (fixes “first post OK, rest still EN” skips)
      if (!locPost.title || locPost.title === enPost?.title) return true;
      if (!locPost.excerpt || locPost.excerpt === enPost?.excerpt) return true;
      const enComments = enPost?.comments ?? [];
      const locComments = locPost?.comments ?? [];
      if (locComments.length !== enComments.length) return true;
      for (let i = 0; i < enComments.length; i++) {
        const enBody = enComments[i]?.body;
        const locBody = locComments[i]?.body;
        if (!locBody || (enBody && locBody === enBody)) return true;
      }
    }
    if (en.categories && typeof en.categories === 'object') {
      const locCat = parsed?.categories;
      for (const key of Object.keys(en.categories)) {
        const enLabel = en.categories[key];
        const locLabel = locCat?.[key];
        if (!locLabel || locLabel === enLabel) return true;
      }
    }
    return false;
  } catch {
    return true;
  }
}

function blogBodyFingerprint(body) {
  if (body == null) return '';
  if (typeof body === 'string') return body.trim();
  return JSON.stringify(body);
}

function blogBundleIncomplete(dest, src) {
  if (!fs.existsSync(dest)) return true;
  try {
    const enRaw = fs.readFileSync(src, 'utf8');
    const destRaw = fs.readFileSync(dest, 'utf8');
    const en = parseBlogFrontmatter(enRaw);
    const destEnd = destRaw.indexOf('\n---', 3);
    const destData = JSON.parse(destRaw.slice(3, destEnd));
    const titleOk = Boolean(destData?.title && destData.title !== en?.title);
    const descOk = Boolean(destData?.desc && destData.desc !== en?.desc);
    const enBody = blogBodyFingerprint(en?.body);
    const locBody = blogBodyFingerprint(destData?.body);
    const bodyOk =
      enBody.length <= 80 ||
      (locBody.length > 0 && locBody !== enBody && locBody.length >= enBody.length * 0.5);
    if (titleOk && descOk && bodyOk) return false;
    return true;
  } catch {
    return true;
  }
}

function isUpToDate(src, dest, locale, kind) {
  if (FORCE || !fs.existsSync(dest)) return false;
  if (kind === 'blog') {
    if (blogBundleIncomplete(dest, src)) return false;
    // Title/desc already differ from EN — do not re-run Gemini when blog/en was re-exported (mtime only).
    return true;
  }
  if (isSeoJson(dest)) {
    if (seoBundleIncomplete(dest, locale)) return false;
    return true;
  }
  if (isProductJson(dest)) {
    if (productBundleIncomplete(dest, locale)) return false;
    return true;
  }
  if (kind === 'status-ui' && isMainI18nJson(dest)) return !statusBundleIncomplete(dest, locale);
  if (kind === 'forum-ui' && isMainI18nJson(dest)) {
    if (i18nForumUiIncomplete(dest, locale)) return false;
    return true;
  }
  if (isMainI18nJson(dest)) {
    if (i18nBundleIncomplete(dest, locale)) return false;
    return true;
  }
  if (isForumJson(dest)) {
    if (forumBundleIncomplete(dest, locale)) return false;
    return true;
  }
  return fs.statSync(dest).mtimeMs >= fs.statSync(src).mtimeMs;
}

function includeKind(kinds, ...aliases) {
  if (!kinds?.length) return true;
  return aliases.some((a) => kinds.includes(a));
}

function buildJobCandidates() {
  const jobs = [];
  const blogEnDir = path.join(projectRoot, 'src/content/blog/en');

  const localeFilter = process.env.TRANSLATE_LOCALES?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const locales = localeFilter?.length ? LOCALES.filter((l) => localeFilter.includes(l)) : LOCALES;
  const kinds = process.env.TRANSLATE_KINDS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const locale of locales) {
    if (includeKind(kinds, 'json', 'i18n', 'ui', 'pages')) {
      jobs.push({
        kind: 'json',
        locale,
        src: i18nEnPath,
        dest: path.join(projectRoot, 'src/i18n', `${locale}.json`),
      });
    }
    if (includeKind(kinds, 'forum-ui')) {
      jobs.push({
        kind: 'forum-ui',
        locale,
        src: i18nEnPath,
        dest: path.join(projectRoot, 'src/i18n', `${locale}.json`),
      });
    }
    if (includeKind(kinds, 'status-ui', 'status')) {
      jobs.push({
        kind: 'status-ui',
        locale,
        src: i18nEnPath,
        dest: path.join(projectRoot, 'src/i18n', `${locale}.json`),
      });
    }
    if (includeKind(kinds, 'seo')) {
      jobs.push({
        kind: 'seo',
        locale,
        src: seoEnPath,
        dest: path.join(projectRoot, 'src/i18n/seo', `${locale}.json`),
      });
    }
    if (includeKind(kinds, 'forum')) {
      jobs.push({
        kind: 'forum',
        locale,
        src: forumEnPath,
        dest: path.join(projectRoot, 'src/i18n/forum', `${locale}.json`),
      });
    }
    if (includeKind(kinds, 'product') && fs.existsSync(productEnPath)) {
      jobs.push({
        kind: 'product',
        locale,
        src: productEnPath,
        dest: path.join(projectRoot, 'src/i18n/product', `${locale}.json`),
      });
    }
  }

  if (fs.existsSync(blogEnDir) && includeKind(kinds, 'blog')) {
    for (const file of fs.readdirSync(blogEnDir).filter((f) => f.endsWith('.md'))) {
      const src = path.join(blogEnDir, file);
      for (const locale of locales) {
        jobs.push({
          kind: 'blog',
          locale,
          src,
          dest: path.join(projectRoot, 'src/content/blog', locale, file),
        });
      }
    }
  }

  return jobs;
}

/** Drop duplicate status-ui / forum-ui when a full json pass is already queued for the same file. */
function filterPendingJobs(candidates) {
  const pending = candidates.filter((j) => !isUpToDate(j.src, j.dest, j.locale, j.kind));
  const pendingJsonDests = new Set(pending.filter((j) => j.kind === 'json').map((j) => j.dest));
  let jobs = pending.filter((j) => {
    if ((j.kind === 'forum-ui' || j.kind === 'status-ui') && pendingJsonDests.has(j.dest)) {
      return false;
    }
    return true;
  });
  jobs = sortJobsForResume(jobs);
  const skippedComplete = candidates.length - pending.length;
  const skippedDuplicate = pending.length - jobs.length;
  return { jobs, skippedComplete, skippedDuplicate };
}

function buildJobs() {
  return filterPendingJobs(buildJobCandidates()).jobs;
}

async function geminiGenerate(prompt, { jsonMode = false } = {}) {
  const models = [activeModel, ...MODEL_FALLBACKS.filter((m) => m !== activeModel)];
  let lastErr;
  let sawRateLimit = false;
  for (const model of models) {
    for (let attempt = 0; attempt < 8; attempt++) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(currentApiKey())}`;
      const generationConfig = { temperature: 0.2 };
      if (jsonMode) generationConfig.responseMimeType = 'application/json';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig,
        }),
      });
      if (res.status === 429 || res.status === 503) {
        sawRateLimit = true;
        if (rotateApiKey(String(res.status))) {
          attempt = -1;
          continue;
        }
        lastErr = new Error(
          `Gemini ${res.status} (quota or rate limit on ${model}) — add GEMINI_API_KEYS with a second project key, wait, then re-run npm run translate`,
        );
        lastErr.status = res.status;
        await sleep(DELAY_MS * 2 ** Math.min(attempt, 5));
        continue;
      }
      if (res.status === 404) {
        lastErr = new Error(`Gemini model ${model} not available for this API key`);
        break;
      }
      if (!res.ok) {
        throw new Error(`Gemini HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
      }
      activeModel = model;
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Gemini empty response');
      return text;
    }
  }
  if (sawRateLimit) throw lastErr;
  throw lastErr ?? new Error('Gemini request failed');
}

const KEYWORD_KEEP_RULE = `- Never translate (keep exact English/Latin spelling and casing when shown): Apex Legends, Apex; EA, Respawn; Javelin, Easy Anti-Cheat, EAC; ESP, HWID, DMA, FOV; Aimbot, Wallhack, Spoofer.
- Also keep cheatsapexlegends.org, Zadeyo, Discord, USD prices, product URL paths, and every [[T#]] placeholder unchanged.
- Do not translate footer "More sites" sister-site labels (each ends with "cheats").`;

function jsonPrompt(locale, protectedText) {
  return `You are a professional translator for an Apex Legends (Windows PC) software website (cheatsapexlegends.org).
Translate this JSON file from English to ${LANG_NAME[locale]} (${locale}).
Rules:
- Return ONLY valid JSON, no markdown fences or commentary.
- Keep every JSON key unchanged (id, href, slug, domain, discord, icon, topic, bento, tags, etc.).
- Translate every human-readable string — nothing may stay in English except protected brand/tech terms in the keep list.
- You MUST translate: the entire status block (pageDesc, aceReminder, activeLine*, every update title/when/summary), features.items[].subtitle (module titles stay English), toolkit productPage strings, setup/compatibility/workflow copy, FAQ, and product cards.
- Keep every placeholder like [[T1]], [[T2]] exactly as-is (do not translate or remove them).
${KEYWORD_KEEP_RULE}
- Keep USD prices, product slugs, and external URLs in English/Latin where shown.
- Never use the words "undetected" or "safe".
- Write natural native copy for gamers; avoid word-for-word English calques.

JSON to translate:
${protectedText}`;
}

function seoPrompt(locale, protectedText) {
  const hints = localeSeoKeywords[locale] ?? {};
  return `You are an SEO copywriter and translator for cheatsapexlegends.org (Apex Legends on Windows PC).
Translate this SEO JSON from English to ${LANG_NAME[locale]} (${locale}).

Primary English keywords (must appear verbatim in titles/descriptions where relevant — never translate these phrases):
- Home: ${hints.homePrimary ?? 'apex cheats'}
- Product hub: ${hints.cheatsProduct ?? 'apex hacks'}
- Spoofer: ${hints.spoofer ?? 'HWID Spoofer'}
- Also keep in English when used: ${hints.terms ?? 'Apex cheats, apex hacks, Cheats for Apex Legends, aimbot, ESP, Javelin, HWID Spoofer'}

Rules:
- Return ONLY valid JSON, same structure and keys as input.
- Translate surrounding copy in title and description strings; leave the keyword phrases above in English.
- Title ≤ 60 characters where possible; meta description ≤ 160 characters.
- Keep paths as keys unchanged (/products/apex-cheats/, etc.).
${KEYWORD_KEEP_RULE}
- Never use the words "undetected" or "safe".

JSON to translate:
${protectedText}`;
}

function productJsonPrompt(locale, protectedText) {
  return `You are a professional translator for cheatsapexlegends.org (Apex Legends on Windows PC).
Translate this product-page JSON from English to ${LANG_NAME[locale]} (${locale}).

Rules:
- Return ONLY valid JSON, same structure and keys as input.
- Translate all human-readable strings (overview, body, steps, goodToKnow, limitations, requirements, groupNames, descs, slides, features arrays, loader feature lists, and every product description line).
- Keep JSON keys unchanged (cheats, spoofer, steps, howToGet, etc.).
- Keep placeholder {name} in howToGet exactly as-is.
${KEYWORD_KEEP_RULE}
- Keep USD prices, P31D, P99Y, Zadeyo, Discord, Javelin, EA Javelin Anticheat, HWID, ESP, aimbot, FOV, player ESP, legend ESP where gamers expect Latin/English.
- Feature option names like "FOV", "Smooth", "Skeleton" may stay English if standard in ${LANG_NAME[locale]} gaming UI; translate groupNames and description sentences fully.
- Never use the words "undetected" or "safe".

JSON to translate:
${protectedText}`;
}

function forumJsonPrompt(locale, protectedText) {
  return `You are a professional translator for the cheatsapexlegends.org community forum (Apex Legends on Windows PC).
Translate this forum JSON from English to ${LANG_NAME[locale]} (${locale}).

Rules:
- Return ONLY valid JSON, same structure and keys as input.
- Translate categories.* display names and posts.* title, excerpt, body strings, flair, and comment/reply bodies.
- Keep post slug keys unchanged.
- Keep author names unchanged (SupportStaff, ApexDev_K, SiteMod_Nia, etc.).
- Keep every [[T#]] placeholder exactly as-is.
${KEYWORD_KEEP_RULE}
- Never use the words "undetected" or "safe".

JSON to translate:
${protectedText}`;
}

function parseBlogFrontmatter(raw) {
  const end = raw.indexOf('\n---', 3);
  return JSON.parse(raw.slice(3, end));
}

function blogDateIsoFromEn(date) {
  const raw = String(date ?? '').trim();
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return iso[0].slice(0, 10);
  const mdy = raw.match(/^([A-Za-z.]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (mdy) {
    const months = {
      jan: 1,
      feb: 2,
      mar: 3,
      apr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      aug: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dec: 12,
    };
    const key = mdy[1].replace(/\./g, '').slice(0, 3).toLowerCase();
    const mon = months[key];
    if (mon) {
      return `${mdy[3]}-${String(mon).padStart(2, '0')}-${String(Number(mdy[2])).padStart(2, '0')}`;
    }
  }
  return null;
}

function mergeBlogMetaFromEnglish(enRaw, data) {
  const en = parseBlogFrontmatter(enRaw);
  data.slug = en.slug;
  data.image = en.image;
  data.featured = en.featured;
  data.tag = en.tag;
  const iso = blogDateIsoFromEn(en.date);
  if (iso) data.dateIso = iso;
}

function blogPrompt(locale, protectedText) {
  const inner = protectedText.startsWith('---')
    ? protectedText.slice(protectedText.indexOf('\n', 3) + 1, protectedText.indexOf('\n---', 3))
    : protectedText;
  return `You are a professional translator for cheatsapexlegends.org (Apex Legends on Windows PC).
Translate this blog post JSON frontmatter from English to ${LANG_NAME[locale]} (${locale}).
Rules:
- Return ONLY valid JSON (no markdown fences, no --- lines).
- Keep slug, image, date, featured, tag unchanged; translate title, desc, readTime, and body text fields.
- Keep every placeholder like [[T1]] exactly as-is.
${KEYWORD_KEEP_RULE}
- Preserve HTML tags inside strings.
- Never use the words "undetected" or "safe".

JSON:
${inner}`;
}

function statusPagePrompt(locale, protectedText) {
  return `You are a professional translator for cheatsapexlegends.org (Apex Legends on Windows PC).
Translate this entire status page JSON (page chrome + update cards) from English to ${LANG_NAME[locale]} (${locale}).

Rules:
- Return ONLY valid JSON, same structure and keys as input.
- Translate every human-readable string: eyebrow, title, subtitle, pageDesc, breadcrumb, aceReminderLabel, aceReminder, recentTitle, storeLineup, latestLabel, activeLinePrefix, activeLineActive, activeLineUpdated, and every update title/when/summary.
- Keep id and icon values unchanged on each update entry.
- Localize the "when" date strings naturally for ${LANG_NAME[locale]} readers (month names may be translated).
${KEYWORD_KEEP_RULE}
- Never use the words "undetected" or "safe".

JSON to translate:
${protectedText}`;
}

async function translateStatusUiJob(job) {
  const en = readEnI18n();
  if (!en?.status) {
    throw new Error('src/i18n/en.json missing status — run npm run i18n:export-en');
  }
  const sourceObj = { status: en.status };
  const fileLabel = path.relative(projectRoot, job.dest);
  const buildPrompt = (locale, protectedText) => statusPagePrompt(locale, protectedText);
  const translated = await translateJsonDocument({
    sourceObj,
    locale: job.locale,
    langName: LANG_NAME[job.locale],
    buildPrompt,
    geminiGenerate,
    sleep,
    delayMs: DELAY_MS,
    fileLabel: `${fileLabel} status`,
    maxKeys: 220,
  });
  let localeRoot = {};
  if (fs.existsSync(job.dest)) {
    localeRoot = JSON.parse(fs.readFileSync(job.dest, 'utf8'));
  }
  localeRoot.status = translated.status;
  fs.mkdirSync(path.dirname(job.dest), { recursive: true });
  fs.writeFileSync(job.dest, `${JSON.stringify(localeRoot, null, 2)}\n`, 'utf8');
  console.log(`ok ${fileLabel} (status page)`);
  await sleep(DELAY_MS);
}

async function translateForumUiJob(job) {
  const en = readEnI18n();
  if (!en?.forum) {
    throw new Error('src/i18n/en.json missing forum section — run npm run i18n:export-en');
  }
  const sourceObj = { forum: en.forum };
  const fileLabel = path.relative(projectRoot, job.dest);
  const buildPrompt = (locale, protectedText) => jsonPrompt(locale, protectedText);
  const translated = await translateJsonDocument({
    sourceObj,
    locale: job.locale,
    langName: LANG_NAME[job.locale],
    buildPrompt,
    geminiGenerate,
    sleep,
    delayMs: DELAY_MS,
    fileLabel: `${fileLabel} forum UI`,
  });
  let localeRoot = {};
  if (fs.existsSync(job.dest)) {
    localeRoot = JSON.parse(fs.readFileSync(job.dest, 'utf8'));
  }
  localeRoot.forum = translated.forum;
  fs.mkdirSync(path.dirname(job.dest), { recursive: true });
  fs.writeFileSync(job.dest, `${JSON.stringify(localeRoot, null, 2)}\n`, 'utf8');
  console.log(`ok ${fileLabel} (forum UI)`);
  await sleep(DELAY_MS);
}

async function translateJsonJob(job) {
  if (job.kind !== 'json' && job.kind !== 'seo' && job.kind !== 'forum' && job.kind !== 'product') {
    throw new Error(`translateJsonJob: unexpected kind ${job.kind}`);
  }
  const raw = fs.readFileSync(job.src, 'utf8');
  const sourceObj = JSON.parse(raw);
  const fileLabel = path.relative(projectRoot, job.dest);
  const buildPrompt = (locale, protectedText) => {
    if (job.kind === 'seo') return seoPrompt(locale, protectedText);
    if (job.kind === 'forum') return forumJsonPrompt(locale, protectedText);
    if (job.kind === 'product') return productJsonPrompt(locale, protectedText);
    return jsonPrompt(locale, protectedText);
  };
  const maxKeys =
    job.kind === 'seo'
      ? Number(process.env.TRANSLATE_SEO_CHUNK_KEYS ?? 10)
      : Number(process.env.TRANSLATE_JSON_CHUNK_KEYS ?? 40);
  const merged = await translateJsonDocument({
    sourceObj,
    locale: job.locale,
    langName: LANG_NAME[job.locale],
    buildPrompt,
    geminiGenerate,
    sleep,
    delayMs: DELAY_MS,
    fileLabel,
    maxKeys,
  });
  fs.mkdirSync(path.dirname(job.dest), { recursive: true });
  fs.writeFileSync(job.dest, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
  console.log(`ok ${fileLabel}`);
  await sleep(DELAY_MS);
}

async function translateJob(job) {
  writeTranslateProgress(job);
  if (job.kind === 'status-ui') {
    return translateStatusUiJob(job);
  }
  if (job.kind === 'forum-ui') {
    return translateForumUiJob(job);
  }
  if (job.kind === 'json' || job.kind === 'seo' || job.kind === 'forum' || job.kind === 'product') {
    return translateJsonJob(job);
  }

  const raw = fs.readFileSync(job.src, 'utf8');
  const { text: protectedText, map } = protectContent(raw);
  const prompt = blogPrompt(job.locale, protectedText);

  let lastErr;
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      let out = await geminiGenerate(prompt, { jsonMode: true });
      out = stripCodeFences(out);
      out = scrubForbiddenClaims(restoreContent(out, map));
      if (!placeholdersRestored(out, map)) {
        throw new Error('placeholder restore incomplete');
      }
      let normalized;
      const data = JSON.parse(out.startsWith('---') ? out.slice(3, out.indexOf('\n---', 3)) : out);
      mergeBlogMetaFromEnglish(raw, data);
      normalized = `---\n${JSON.stringify(data, null, 2)}\n---\n`;
      fs.mkdirSync(path.dirname(job.dest), { recursive: true });
      fs.writeFileSync(job.dest, normalized, 'utf8');
      console.log(`ok ${path.relative(projectRoot, job.dest)}`);
      await sleep(DELAY_MS);
      return;
    } catch (err) {
      lastErr = err;
      const wait = DELAY_MS * 2 ** Math.min(attempt, 4);
      const retryable =
        err.status === 429 ||
        err.status === 503 ||
        err instanceof SyntaxError ||
        String(err.message).includes('429') ||
        String(err.message).includes('503') ||
        String(err.message).includes('fetch failed') ||
        String(err.message).includes('placeholder') ||
        String(err.message).includes('JSON') ||
        String(err.message).includes('blog') ||
        String(err.message).includes('Gemini HTTP') ||
        String(err.message).includes('quota or rate limit') ||
        err.status === 429 ||
        err.status === 503;
      if (retryable) {
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
  const detail = lastErr?.message ? `: ${lastErr.message}` : '';
  throw new Error(`failed ${job.dest}${detail}`);
}

function ensureEnglishExport() {
  const needs =
    !fs.existsSync(i18nEnPath) ||
    isEmptyJsonFile(i18nEnPath) ||
    !fs.existsSync(seoEnPath) ||
    isEmptyJsonFile(seoEnPath);
  const enBundlePath = path.join(projectRoot, 'src/i18n/en-bundle.ts');
  const forumDataPath = path.join(projectRoot, 'src/data/forum.ts');
  let i18nEnStale = false;
  if (fs.existsSync(enBundlePath) && fs.existsSync(i18nEnPath)) {
    i18nEnStale = fs.statSync(enBundlePath).mtimeMs > fs.statSync(i18nEnPath).mtimeMs;
  }
  let forumDataStale = false;
  if (fs.existsSync(forumDataPath)) {
    if (!fs.existsSync(forumEnPath)) forumDataStale = true;
    else forumDataStale = fs.statSync(forumDataPath).mtimeMs > fs.statSync(forumEnPath).mtimeMs;
  }
  const refreshEn =
    needs ||
    i18nEnStale ||
    forumDataStale ||
    FORCE ||
    (FORCE && process.env.I18N_EXPORT_BEFORE_TRANSLATE === '1');
  if (refreshEn) {
    console.log('translate: refreshing en.json, seo/en.json, and forum/en.json from English sources…');
    const script = path.join(root, 'export-i18n-en.mjs');
    const run = spawnSync('npx', ['tsx', script], { cwd: projectRoot, stdio: 'inherit', shell: true });
    if (run.status !== 0) {
      process.exit(run.status ?? 1);
    }
  }
  const catalogPath = path.join(projectRoot, 'src/data/product-catalog-en.ts');
  const productMissing = !fs.existsSync(productEnPath) || isEmptyJsonFile(productEnPath);
  let productStale = productMissing;
  if (!productStale && fs.existsSync(catalogPath)) {
    productStale = fs.statSync(catalogPath).mtimeMs > fs.statSync(productEnPath).mtimeMs;
  }
  if (productStale || (FORCE && process.env.I18N_EXPORT_PRODUCT === '1')) {
    console.log('translate: refreshing src/i18n/product/en.json from product catalog…');
    const script = path.join(root, 'export-product-locale-en.mjs');
    const run = spawnSync('node', [script], { cwd: projectRoot, stdio: 'inherit', shell: true });
    if (run.status !== 0) {
      process.exit(run.status ?? 1);
    }
  }
}

async function main() {
  const dryRun = process.env.TRANSLATE_DRY_RUN === '1';
  if (!apiKeys.length && !dryRun) {
    console.error('Missing GEMINI_API_KEY or GEMINI_API_KEYS in .env');
    process.exit(1);
  }
  const protRun = spawnSync('node', [path.join(root, 'export-protected-terms.mjs')], {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  if (protRun.status !== 0) {
    process.exit(protRun.status ?? 1);
  }
  if (apiKeys.length > 1) {
    console.log(`translate: ${apiKeys.length} Gemini API key(s) loaded (rotate on 429)`);
  }
  ensureEnglishExport();
  if (process.env.TRANSLATE_KINDS?.trim()) {
    console.log(`translate: TRANSLATE_KINDS=${process.env.TRANSLATE_KINDS} (not a full run — unset for one command for everything)`);
  }
  if (process.env.TRANSLATE_LOCALES?.trim()) {
    console.log(`translate: TRANSLATE_LOCALES=${process.env.TRANSLATE_LOCALES}`);
  }
  const { jobs, skippedComplete, skippedDuplicate } = filterPendingJobs(buildJobCandidates());
  const resume = readTranslateProgress();
  if (skippedComplete > 0 || skippedDuplicate > 0) {
    console.log(
      `translate: resume — ${skippedComplete} already complete (skipped), ${skippedDuplicate} duplicate UI pass(es) skipped`,
    );
  }
  if (resume?.dest && jobs.length > 0) {
    console.log(`translate: continuing near ${resume.dest} (${resume.kind}, ${resume.locale})`);
  }
  console.log(`translate: ${jobs.length} file(s) to run`);
  if (process.env.TRANSLATE_DRY_RUN === '1') {
    for (const job of jobs) {
      console.log(`  - ${path.relative(projectRoot, job.dest)} (${job.kind})`);
    }
    return;
  }
  if (jobs.length === 0) {
    console.log('translate: nothing to do (all targets up to date). Run npm run i18n:export-en only when English JSON changed.');
    return;
  }
  const failed = [];
  for (const job of jobs) {
    const label = path.relative(projectRoot, job.dest);
    console.log(`translate: working on ${label} (${job.kind})…`);
    try {
      await translateJob(job);
    } catch (err) {
      const msg = err?.message ?? String(err);
      console.error(`translate: FAILED ${label} (${job.kind}): ${msg}`);
      failed.push({ label, kind: job.kind, message: msg });
    }
  }
  if (failed.length) {
    console.error(`translate: finished with ${failed.length} failed job(s). Re-run translate to retry incomplete files.`);
    process.exit(1);
  }
  const kindsRan = process.env.TRANSLATE_KINDS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const auditUi =
    !kindsRan?.length ||
    kindsRan.some((k) => ['json', 'status-ui', 'forum-ui', 'seo', 'product', 'forum', 'i18n', 'ui', 'pages'].includes(k));
  const leftovers = auditUi ? countEnglishLeftoversAllLocales() : { total: 0, byLocale: [] };
  if (leftovers.total > 0) {
    console.error(
      `translate: finished but ${leftovers.total} UI string(s) still identical to English (run npm run translate:ui or FORCE_TRANSLATE=1 npm run translate)`,
    );
    for (const row of leftovers.byLocale.slice(0, 8)) {
      console.error(`  - ${row.locale}: ${row.count} (e.g. ${row.sample})`);
    }
    process.exit(1);
  }
  console.log('translate: done (no English leftovers in locale JSON)');
}

function countEnglishLeftoversAllLocales() {
  const en = readEnI18n();
  if (!en) return { total: 0, byLocale: [] };
  const byLocale = [];
  let total = 0;
  for (const locale of LOCALES) {
    const dest = path.join(projectRoot, 'src/i18n', `${locale}.json`);
    if (!fs.existsSync(dest)) continue;
    try {
      const parsed = JSON.parse(fs.readFileSync(dest, 'utf8'));
      if (i18nBundleIncomplete(dest, locale) || hasEnglishCopy(en, parsed)) {
        const n = countEnglishLeaves(en, parsed);
        if (n > 0) {
          total += n;
          byLocale.push({ locale, count: n, sample: firstEnglishLeaf(en, parsed) ?? '…' });
        }
      }
    } catch {
      byLocale.push({ locale, count: 1, sample: 'parse error' });
      total += 1;
    }
  }
  return { total, byLocale };
}

function countEnglishLeaves(enNode, locNode) {
  let n = 0;
  walkEnglishLeaves(enNode, locNode, '', (pathKey) => {
    n += 1;
    if (n === 1) countEnglishLeaves.lastPath = pathKey;
  });
  return n;
}
countEnglishLeaves.lastPath = '';

function firstEnglishLeaf(enNode, locNode) {
  countEnglishLeaves(enNode, locNode);
  return countEnglishLeaves.lastPath;
}

function walkEnglishLeaves(enNode, locNode, prefix, onHit) {
  if (enNode == null || locNode == null) return;
  if (typeof enNode === 'string' && typeof locNode === 'string') {
    const t = enNode.trim();
    if (t.length >= 3 && locNode === enNode && !stringMayStayEnglish(enNode)) onHit(prefix);
    return;
  }
  if (Array.isArray(enNode) && Array.isArray(locNode)) {
    for (let i = 0; i < enNode.length; i++) {
      walkEnglishLeaves(enNode[i], locNode[i], `${prefix}[${i}]`, onHit);
    }
    return;
  }
  if (typeof enNode === 'object' && typeof locNode === 'object') {
    for (const key of Object.keys(enNode)) {
      if (TRANSLATE_SKIP_KEYS.has(key)) continue;
      walkEnglishLeaves(enNode[key], locNode[key], prefix ? `${prefix}.${key}` : key, onHit);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
