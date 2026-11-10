/** Primary keyword per URL (null = no target keyword). */
export const PAGE_KEYWORDS: Record<string, string | null> = {
  '/': 'apex cheats',
  '/products/apex-cheats/': 'apex hack',
  '/products/apex-cheats/loader/': null,
  '/products/apex-cheats/hwid-spoofer/': 'apex spoofer',
  '/products/apex-cheats/utilities/': null,
  '/blog/': null,
  '/forum/': null,
  '/faq/': null,
  '/support/': null,
  '/status/': null,
  '/about/': null,
  '/privacy/': null,
  '/terms/': null,
};

/** Reserved for future blog posts — do not use as a primary page keyword elsewhere. */
export const RESERVED_BLOG_KEYWORDS = [
  'apex hacks',
  'apex aimbot',
  'apex esp',
  'esp apex',
  'apex dma cheats',
  'apex dma',
  'apex anticheat',
  'best apex cheats',
] as const;

export const PRODUCT_H1: Record<string, string> = {
  loader: 'Apex hack',
  'hwid-spoofer': 'Apex spoofer',
};

export const PRODUCT_PAGE_KEYWORDS: Record<string, string> = {
  loader: 'apex hack',
  'hwid-spoofer': 'apex spoofer',
};

export function primaryKeywords(): string[] {
  return Object.values(PAGE_KEYWORDS).filter((k): k is string => Boolean(k));
}

export const KEYWORD_LINK_LABELS: Record<string, string> = {
  '/': 'Apex cheats',
  'apex-hack': 'Apex hack',
  loader: 'Apex hack',
  'hwid-spoofer': 'Apex spoofer',
};
