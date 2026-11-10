/**
 * Terms that must stay identical in every locale (translate script + i18n:check).
 * Also exported to scripts/protected-terms.json.
 */
import { SISTER_SITE_LABELS } from '../data/sister-sites';

/** Game title and short brand — never translate. */
export const PROTECTED_GAME_NAMES = [
  'Apex Legends',
  'Apex',
  'Apex cheats',
  'apex cheats',
  'Apex hack',
  'apex hack',
  'Apex Legends Cheats',
  'Cheats for Apex Legends',
] as const;

/** Publishers / studios — never translate. */
export const PROTECTED_BRAND_ENTITIES = ['EA', 'Respawn', 'Zadeyo', 'cheatsapexlegends.org'] as const;

/** Anti-cheat product names — never translate. */
export const PROTECTED_ANTICHEAT = [
  'Javelin',
  'EA Javelin',
  'EA Javelin Anticheat',
  'Easy Anti-Cheat',
  'EAC',
  'VAC',
] as const;

/** Universal gaming / hardware acronyms — never translate. */
export const PROTECTED_TECH_ACRONYMS = ['ESP', 'HWID', 'DMA', 'FOV', 'HVCI', 'TPM', 'UEFI', 'PC'] as const;

/** Standard cheat jargon — no direct localization. */
export const PROTECTED_CHEAT_JARGON = [
  'Aimbot',
  'aimbot',
  'Wallhack',
  'wallhack',
  'Spoofer',
  'HWID Spoofer',
  'apex spoofer',
] as const;

export const PROTECTED_SITE_NAMES = [
  'apex hacks',
  'apex esp',
  'esp apex',
  'HWID Spoofer',
] as const;

export const PROTECTED_PRODUCT_NAMES = ['Apex hack', 'Apex spoofer', 'Apex cheats', 'HWID Spoofer'] as const;

export const PROTECTED_SEO_KEYWORDS = [
  'apex hacks',
  'apex aimbot',
  'apex dma cheats',
  'apex dma',
  'apex anticheat',
  'best apex cheats',
  'player esp',
  'skeleton esp',
  'health esp',
  'streamproof overlay',
] as const;

export const PROTECTED_CHEAT_TERMS = [
  'Loader',
  'Skeleton',
  'Stream-Proof',
  'No Recoil',
  'Smooth',
  'Config',
  'chams',
] as const;

export const PROTECTED_KEYS_AND_TECH = [
  'Insert',
  'End',
  'RMB',
  'LMB',
  'Mouse 4',
  'Windows',
  'Windows 10',
  'Windows 11',
  'Intel',
  'AMD',
  'Discord',
  'Steam',
  'Secure Boot',
  'Core isolation',
  'core isolation',
  'secure boot',
] as const;

export const PROTECTED_MONEY_AND_VERSIONS = [
  '$35',
  '$50',
  '$150',
  'USD',
  'Lifetime',
  'Monthly',
  '31 days',
  'Lifetime $150',
  '$35 for 31 days',
  '$50 for 31 days',
  'USD · 31-day access',
  'USD · lifetime access',
  'P31D',
  'P99Y',
] as const;

export const PROTECTED_FOOTER_SITES = SISTER_SITE_LABELS;

/** Flat list for JSON export and i18n:check (longest first for substring checks). */
export const PROTECTED_TERMS: readonly string[] = [
  ...new Set([
    ...PROTECTED_GAME_NAMES,
    ...PROTECTED_BRAND_ENTITIES,
    ...PROTECTED_ANTICHEAT,
    ...PROTECTED_TECH_ACRONYMS,
    ...PROTECTED_CHEAT_JARGON,
    ...PROTECTED_SITE_NAMES,
    ...PROTECTED_PRODUCT_NAMES,
    ...PROTECTED_CHEAT_TERMS,
    ...PROTECTED_KEYS_AND_TECH,
    ...PROTECTED_MONEY_AND_VERSIONS,
    ...PROTECTED_FOOTER_SITES,
    ...PROTECTED_SEO_KEYWORDS,
  ]),
].sort((a, b) => b.length - a.length);
