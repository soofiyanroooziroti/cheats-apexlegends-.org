/** UI + product + SEO + forum JSON first (no blog posts). */
process.env.TRANSLATE_KINDS = 'json,status-ui,forum-ui,seo,product,forum';
await import('./translate.mjs');
