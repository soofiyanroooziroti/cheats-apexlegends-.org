import { defaultLocale, getTranslations, type Locale } from '../i18n';
import {
  STATUS_LAST_UPDATED,
  formatStatusUpdated,
  isLegacyDayzStatusBlob,
  type StatusUpdateEntry,
} from './status';

export type StatusPageCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  pageDesc: string;
  breadcrumb: string;
  storeLineup: string;
  recentTitle: string;
  latestLabel: string;
  aceReminder: string;
  updates: StatusUpdateEntry[];
};

function statusBlock(locale?: Locale | null) {
  const loc = locale ?? defaultLocale;
  return getTranslations(loc).status as Record<string, unknown> | undefined;
}

function updatesFromLocale(locale?: Locale | null): StatusUpdateEntry[] | undefined {
  const raw = statusBlock(locale)?.updates;
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const out: StatusUpdateEntry[] = [];
  for (const row of raw) {
    if (!row || typeof row !== 'object') continue;
    const { title, when, summary, icon } = row as Record<string, unknown>;
    if (typeof title === 'string' && typeof when === 'string' && typeof summary === 'string') {
      const known = ['shield', 'mapHack', 'zap', 'settings', 'alert', 'tag'] as const;
      const picked = known.find((name) => name === icon);
      out.push({ title, when, summary, ...(picked ? { icon: picked } : {}) });
    }
  }
  return out.length ? out : undefined;
}

function resolveStatusUpdates(locale?: Locale | null): StatusUpdateEntry[] {
  const loc = locale ?? defaultLocale;
  const localeUpdates = updatesFromLocale(loc);
  if (localeUpdates?.length) {
    const blob = localeUpdates.map((entry) => `${entry.title} ${entry.summary}`).join(' ');
    if (!isLegacyDayzStatusBlob(blob)) return localeUpdates;
  }
  return updatesFromLocale(defaultLocale) ?? [];
}

export function getStatusPageContent(locale?: Locale | null): StatusPageCopy {
  const s = statusBlock(locale);
  const en = statusBlock(defaultLocale);
  const updates = resolveStatusUpdates(locale);

  return {
    eyebrow: (s?.eyebrow as string) ?? (en?.eyebrow as string) ?? 'Patch notes',
    title: (s?.title as string) ?? (en?.title as string) ?? 'Status label before you load',
    subtitle: (s?.subtitle as string) ?? (en?.subtitle as string) ?? '',
    pageDesc:
      (s?.pageDesc as string) && !isLegacyDayzStatusBlob(String(s?.pageDesc))
        ? (s.pageDesc as string)
        : ((en?.pageDesc as string) && !isLegacyDayzStatusBlob(String(en?.pageDesc))
            ? (en.pageDesc as string)
            : ''),
    breadcrumb: (s?.breadcrumb as string) ?? (en?.breadcrumb as string) ?? 'Status',
    storeLineup: (s?.storeLineup as string) ?? (en?.storeLineup as string) ?? 'Store lineup',
    recentTitle: (s?.recentTitle as string) ?? (en?.recentTitle as string) ?? 'Recent updates',
    latestLabel: (s?.latestLabel as string) ?? (en?.latestLabel as string) ?? 'Latest',
    aceReminder: (s?.aceReminder as string) ?? (en?.aceReminder as string) ?? '',
    updates,
  };
}

export function formatActiveStatusLine(
  locale?: Locale | null,
  isoDate: string = STATUS_LAST_UPDATED,
): string {
  const s = statusBlock(locale);
  const en = statusBlock(defaultLocale);
  const active = (s?.activeLineActive as string) ?? (en?.activeLineActive as string) ?? 'Active';
  const updatedLabel =
    (s?.activeLineUpdated as string) ?? (en?.activeLineUpdated as string) ?? 'Updated {date}';
  const date = formatStatusUpdated(isoDate, locale);
  return `${active} · ${updatedLabel.replace('{date}', date)}`;
}
