/**
 * Locales included in Astro `i18n` config — keep in sync with src/i18n/config.ts.
 * English-only ship: restore other codes here + in config.ts when locales are ready.
 */
export const defaultLocale = 'en';

export const shipLocales = ['en'];

export const nonDefaultShipLocales = shipLocales.filter((l) => l !== defaultLocale);

/** Human-readable names for translate.mjs prompts. */
export const langName = {
  ja: 'Japanese',
  'zh-cn': 'Simplified Chinese',
  es: 'Spanish',
  ru: 'Russian',
  'pt-br': 'Portuguese (Brazil)',
  de: 'German',
  fr: 'French',
  ko: 'Korean',
};

export function localeFromPathname(pathname) {
  const seg = pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  if (seg && nonDefaultShipLocales.includes(seg)) return seg;
  return defaultLocale;
}
