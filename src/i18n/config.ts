export const defaultLocale = 'en' as const;

export interface LocaleConfigEntry {
  code: string;
  urlPrefix: string;
  nativeName: string;
  shortLabel: string;
  hreflang: string;
  htmlLang: string;
  dir: 'ltr' | 'rtl';
  ogLocale: string;
  /** When true, use system UI fonts only (no Manrope/Rajdhani files). */
  systemFontsOnly?: boolean;
}

/**
 * Shipped languages — English-only until locales are translated (sync with scripts/locale-ship.mjs).
 */
export const localeConfig: readonly LocaleConfigEntry[] = [
  {
    code: 'en',
    urlPrefix: '',
    nativeName: 'English',
    shortLabel: 'EN',
    hreflang: 'en',
    htmlLang: 'en',
    dir: 'ltr',
    ogLocale: 'en_US',
  },
] as const satisfies readonly LocaleConfigEntry[];
