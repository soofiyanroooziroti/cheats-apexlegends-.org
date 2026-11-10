import type { Locale } from '../i18n/locales';

/**
 * Compact region/market codes (US, FR, CZ, …) — used for flag filenames under `/public/images/flags/`.
 */
export const localeRegionCode: Record<Locale, string> = {
  en: 'US',
  ja: 'JP',
  'zh-cn': 'CN',
  es: 'ES',
  ru: 'RU',
  'pt-br': 'BR',
  de: 'DE',
  fr: 'FR',
  ko: 'KR',
};

/** Public URL for the menu flag image (flat SVG, same basename as localeRegionCode lowercased). */
export function localeFlagSrc(code: Locale): string {
  const key = localeRegionCode[code].toLowerCase();
  return `/images/flags/${key}.svg`;
}
