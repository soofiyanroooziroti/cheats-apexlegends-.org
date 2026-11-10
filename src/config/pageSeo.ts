export interface PageSeoEntry {
  title: string;
  description: string;
}

export const PAGE_SEO: Record<string, PageSeoEntry> = {
  '/': {
    title: 'Apex cheats for Windows PC | Menu, ESP & Aimbot',
    description:
      'Apex cheats on Windows PC: squad ESP, aim assist tuning, loot filters, and saved configs. $35 and $150 USD plans with live status before you load.',
  },
  '/products/apex-cheats/': {
    title: 'Apex hack for PC | Menu and HWID spoofer cards',
    description:
      'Compare the Apex hack menu and HWID spoofer: separate Zadeyo checkouts, $35/$150 menu and $50/$150 spoofer, portal delivery worldwide.',
  },
  '/products/apex-cheats/loader/': {
    title: 'Apex menu | Aimbot, player ESP & world toggles',
    description:
      'Loader feature list: aimbot sliders, player and world visuals, misc configs. Same modules on the 31-day and lifetime plans.',
  },
  '/products/apex-cheats/hwid-spoofer/': {
    title: 'Apex spoofer for hardware flags on PC',
    description:
      'Apex spoofer workflow when a new account fails on one PC: disk, MAC, and GPU rotation. It does not clear account-only penalties.',
  },
  '/products/apex-cheats/utilities/': {
    title: 'HWID utility overview',
    description:
      'When a hardware flag blocks fresh accounts on one machine, the spoofer is a separate checkout from the menu.',
  },
  '/blog/': {
    title: 'Apex guides hub | Setup, Javelin risk, and module notes',
    description:
      'Guides on menu tuning, checkout, patch-day habits, and hardware flags. Articles link to the loader and HWID spoofer pages on cheatsapexlegends.org.',
  },
  '/forum/': {
    title: 'Community threads on setup and plans',
    description:
      'Closed threads on checkout, hardware flags, and loader questions with marked staff replies.',
  },
  '/faq/': {
    title: 'FAQ on plans, Javelin risk, and setup',
    description:
      'Answers on $35 and $150 menu plans, EA Javelin risk, Windows requirements, hardware flags, and how products differ.',
  },
  '/support/': {
    title: 'Support for loader, checkout, and portal',
    description:
      'Loader, checkout, and portal help for the menu and spoofer. Include your order email and Windows build.',
  },
  '/about/': {
    title: 'About cheatsapexlegends.org | Delivery, pricing, and risk',
    description:
      'What this store sells, portal key delivery, USD menu and spoofer pricing, ban risk under EA Javelin, and how GREEN or RED status labels fit checkout on PC.',
  },
  '/privacy/': {
    title: 'Privacy notes for analytics and contact',
    description:
      'How cheatsapexlegends.org handles analytics, cookies, and contact data. Card numbers stay on the checkout provider.',
  },
  '/terms/': {
    title: 'License terms, refunds, and acceptable use',
    description:
      'License terms and the no-refund rule for the loader and HWID spoofer sold here.',
  },
  '/status/': {
    title: 'Status label and client patch notes',
    description:
      'GREEN means the note lists the file to load. RED means wait. Read after an Apex Legends or Javelin update.',
  },
};

export function normalizeSeoPath(pathname: string): string {
  let path = pathname || '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path !== '/' && !path.endsWith('/')) path = `${path}/`;
  return path;
}

export function getPageSeoEntry(pathname: string): PageSeoEntry | undefined {
  return PAGE_SEO[normalizeSeoPath(pathname)];
}
