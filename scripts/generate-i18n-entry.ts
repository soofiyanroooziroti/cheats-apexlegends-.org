import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildEnBundle } from '../src/i18n/en-bundle.ts';
import { PAGE_SEO } from '../src/config/pageSeo.ts';
import { blogPosts } from '../src/data/blog/posts.ts';
import { forumPosts } from '../src/data/forum.ts';
import { localeConfig, defaultLocale } from '../src/i18n/config.ts';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const i18nDir = path.join(root, 'src', 'i18n');
const contentBlogDir = path.join(root, 'src', 'content', 'blog', 'en');
const seoDir = path.join(i18nDir, 'seo');
const exportEnOnly = process.argv.includes('--en-only');

const shipLocales = localeConfig.map((e) => e.code);

fs.mkdirSync(seoDir, { recursive: true });
fs.mkdirSync(contentBlogDir, { recursive: true });

const enMerged = buildEnBundle();
fs.writeFileSync(path.join(i18nDir, 'en.json'), `${JSON.stringify(enMerged, null, 2)}\n`);

const pages: Record<string, { title: string; description: string }> = { ...PAGE_SEO };
for (const post of blogPosts) {
  pages[`/blog/${post.slug}/`] = {
    title: post.seoTitle?.trim() || post.title,
    description: post.desc,
  };
}
for (const post of forumPosts) {
  pages[`/forum/${post.slug}/`] = {
    title: post.title,
    description: post.description,
  };
}

const seoEn = {
  site: { title: enMerged.site.title, description: enMerged.site.description },
  pages,
};
fs.writeFileSync(path.join(seoDir, 'en.json'), `${JSON.stringify(seoEn, null, 2)}\n`);

if (exportEnOnly) {
  for (const post of blogPosts) {
    const { body, ...meta } = post;
    fs.writeFileSync(
      path.join(contentBlogDir, `${post.slug}.md`),
      `---\n${JSON.stringify({ ...meta, body }, null, 2)}\n---\n`,
    );
  }
  const forumExport = path.join(path.dirname(fileURLToPath(import.meta.url)), 'export-forum-en.mjs');
  const forumRun = spawnSync('npx', ['tsx', forumExport], { cwd: root, stdio: 'inherit', shell: true });
  if (forumRun.status !== 0) {
    process.exit(forumRun.status ?? 1);
  }
  console.log(`export-en: en.json, seo/en.json, forum/en.json, ${blogPosts.length} blog/en/*.md`);
} else {
  const placeholder = '{}\n';
  for (const code of shipLocales) {
    if (code === defaultLocale) continue;
    fs.writeFileSync(path.join(i18nDir, `${code}.json`), placeholder);
    fs.writeFileSync(path.join(seoDir, `${code}.json`), placeholder);
  }
  for (const post of blogPosts) {
    const { body, ...meta } = post;
    fs.writeFileSync(
      path.join(contentBlogDir, `${post.slug}.md`),
      `---\n${JSON.stringify({ ...meta, body }, null, 2)}\n---\n`,
    );
  }
  console.log(
    `Generated i18n placeholders (${shipLocales.filter((c) => c !== defaultLocale).join(', ')}) + ${blogPosts.length} blog/en/*.md`,
  );
}
