/** ISO date (YYYY-MM-DD) — edit when you publish a status refresh. */
export const STATUS_LAST_UPDATED = '2026-11-10';

export interface StatusUpdateEntry {
  id?: string;
  title: string;
  when: string;
  summary: string;
  icon?: 'shield' | 'mapHack' | 'zap' | 'settings' | 'alert' | 'tag';
}

/** Public anti-cheat context — prepended on every locale (see status-locale.ts). */
export const STATUS_JAVELIN_MILESTONES: StatusUpdateEntry[] = [
  {
    id: 'ranked-cipher',
    title: 'Ranked enforcement after the Cipher patch',
    icon: 'alert',
    when: 'Nov 4, 2026',
    summary:
      'After the Season 31 Cipher patch, Respawn suspended 906 accounts for up to 365 days. The cases were a matchmaking exploit that skipped Ranked entry costs. That wave is an account suspension. It is not a confirmed ID ban. In most cases there is no ID ban.',
  },
  {
    id: 'season-31',
    title: 'Season 31 on live servers',
    icon: 'mapHack',
    when: 'Nov 3, 2026',
    summary:
      'Season 31 added Strongholds (loot bunkers a squad can capture), Akimbo Wingmans on heavy ammo, a Crypto rework with a full-circle drone scan, and Legend bans before the match in Diamond and above. A client shift like that makes a note from an older build stale. Read this page again before you load.',
  },
  {
    id: 'javelin-handoff',
    title: 'PC anti-cheat moved to EA Javelin',
    icon: 'shield',
    when: 'Sep 29, 2026',
    summary:
      'Respawn replaced Easy Anti-Cheat on PC with EA Javelin Anticheat. EA describes it as aimed at kernel-level cheats and other third-party software, and cites an accuracy rate above 99%. That figure is their claim. It is not a confirmed ID ban, and it is not a claim that a file bypasses easily. In most cases there is no ID ban. A GREEN label here is still only the current file check.',
  },
  {
    id: 'adapter-macro-bans',
    title: 'Adapters and recoil scripts banned',
    icon: 'zap',
    when: 'Mar 4 – Jul 9, 2026',
    summary:
      'External input adapters (Cronus, XIM, Titan, Strikepack) and recoil-cancel scripts (jitter macros and RC filters) are against publisher rules on PC and console. Reports on those tools are behavior flags. They are not a confirmed ID ban. In most cases there is no ID ban.',
  },
  {
    id: 'windows-baseline',
    title: 'Windows security baseline',
    icon: 'settings',
    when: '2026',
    summary:
      'Supported builds keep HVCI, core isolation, TPM, and secure boot enabled. Turning them off for a loader is a common support failure, not a fix for a RED status label.',
  },
];

/** Store lineup notes — newest first after milestones on the status page. */
export const STATUS_STORE_NOTES: StatusUpdateEntry[] = [
  {
    id: 'status-label',
    title: 'Status label',
    icon: 'shield',
    when: 'Nov 8, 2026',
    summary:
      'GREEN means this note lists the current file to load. RED means wait. Read this page after an Apex Legends or Javelin update before you launch. The label is not an undetected claim.',
  },
  {
    id: 'menu-covers',
    title: 'What the menu covers',
    icon: 'mapHack',
    when: 'Nov 8, 2026',
    summary:
      'The published menu lists Player ESP, Advanced Aimbot, Weapon ESP, Health Bar, Distance ESP, Box ESP, Skeleton ESP, Loot ESP, No Recoil, EA Javelin Bypass, Stream Proof, and 24/7 Support. The bypass row is a module name, not a claim that it bypasses easily, and not a confirmed ID ban. In most cases there is no ID ban.',
  },
  {
    id: 'plans-unchanged',
    title: 'Plans on the menu',
    icon: 'tag',
    when: 'Nov 8, 2026',
    summary:
      'The 31-day and lifetime keys unlock the same module list. Lifetime on the menu does not include the HWID spoofer.',
  },
];

export const STATUS_RECENT_UPDATES: StatusUpdateEntry[] = [
  ...STATUS_JAVELIN_MILESTONES,
  ...STATUS_STORE_NOTES,
];

export const STATUS_ACE_REMINDER =
  'Read cheatsapexlegends.org after a Season 31 or Javelin update. A note from before the Cipher patch is not a current build.';

const LOCALE_DATE: Partial<Record<string, string>> = {
  en: 'en-US',
  ja: 'ja-JP',
  'zh-cn': 'zh-CN',
  es: 'es-ES',
  ru: 'ru-RU',
  'pt-br': 'pt-BR',
  de: 'de-DE',
  fr: 'fr-FR',
  ko: 'ko-KR',
};

/** Format YYYY-MM-DD for display (static at build). */
export function formatStatusUpdated(
  isoDate: string = STATUS_LAST_UPDATED,
  locale?: string | null,
): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const tag = locale && LOCALE_DATE[locale] ? LOCALE_DATE[locale] : 'en-US';
  return new Intl.DateTimeFormat(tag, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** Drop stale template copy from other games still present in locale JSON. */
export function isLegacyGameStatusBlob(text: string): boolean {
  return /Badlands|1\.31|1\.30|Nitrado|Nasdara|BattlEye|DayZ|dayz|Warzone cheats|delta-force|PS5 native|Vanguard|Javelin|VALORANT|valorant cheats/i.test(
    text,
  );
}

/** @deprecated Use isLegacyGameStatusBlob */
export const isLegacyDayzStatusBlob = isLegacyGameStatusBlob;
