import type { IconName } from '../components/icons/types';
import { ALL_PRODUCTS_PLANS_LINE } from '../config/product-plans';
import { normalizeInternalPath, productPath, ROUTES } from '../utils/path-core';

export type FaqTopic =
  | 'all'
  | 'plans'
  | 'esp'
  | 'scripts'
  | 'safety'
  | 'products'
  | 'blog'
  | 'setup';

export interface SiteFaqItem {
  id: string;
  topic: FaqTopic;
  icon: IconName;
  q: string;
  a: string;
  aHtml?: string;
  scopes?: string[];
}

function link(text: string, href: string): string {
  return `<a href="${normalizeInternalPath(href)}">${text}</a>`;
}

const cheats = link('the menu', productPath('loader'));
const productsHub = link('products page', ROUTES.products);
const hwid = link('HWID Spoofer', productPath('hwid-spoofer'));

export const siteFaqs: SiteFaqItem[] = [
  {
    id: 'status',
    topic: 'setup',
    icon: 'faqStatus',
    q: 'How do I know the loader matches today’s Apex Legends client?',
    a: 'Open cheatsapexlegends.org/status after any client or Javelin change. Treat yesterday’s GREEN note as stale—do not inject until today’s label lists your build.',
    aHtml: `Open ${link('status', '/status/')} after any client or Javelin change. Treat yesterday’s GREEN note as stale—do not inject until today’s label lists your build.`,
  },
  {
    id: 'after-buy',
    topic: 'setup',
    icon: 'faqAfterBuy',
    q: 'What arrives in the portal after checkout?',
    a: 'You get the Windows loader for the SKU you paid for. Tune Player ESP, aim, and loot tabs, then save a profile. Keep HVCI, core isolation, TPM, and secure boot enabled.',
  },
  {
    id: 'ban-risk',
    topic: 'safety',
    icon: 'faqBanRisk',
    q: 'Is a ban still possible while using the menu?',
    a: 'Yes. Javelin can flag accounts even on conservative presets. This site does not promise a clean session.',
  },
  {
    id: 'hwid-ban-risk',
    topic: 'safety',
    icon: 'faqBanRisk',
    q: 'Hardware flag vs account ban—which is which?',
    a: `When only new logins fail on one tower but work elsewhere, suspect a hardware flag. That is what the separate ${hwid} key is for. Account-only penalties are not fixed by spoofing, and lifetime on ${cheats} never bundles the spoofer.`,
  },
  {
    id: 'platforms',
    topic: 'setup',
    icon: 'faqPlatforms',
    q: 'What machine do I need before I buy?',
    a: 'Windows 10 or 11 64-bit with HVCI, core isolation, TPM, and secure boot enabled, plus the current Apex Legends PC client. Consoles, macOS, and Linux are out of scope.',
  },
  {
    id: 'license-move',
    topic: 'products',
    icon: 'faqLicenseMove',
    q: 'Can I transfer my license to a friend’s PC?',
    a: 'Email support from the purchase address. Keys are not free-floating transfers—persistent hardware blocks need the spoofer checkout, not a courtesy move.',
  },
  {
    id: 'products-page',
    topic: 'products',
    icon: 'faqProductsPage',
    q: 'Which products share one cart?',
    a: `None. ${cheats} and the ${hwid} are separate line items on the ${productsHub}. ${ALL_PRODUCTS_PLANS_LINE}`,
  },
  {
    id: 'plans-same-price',
    topic: 'plans',
    icon: 'faqComparePlans',
    q: 'Does menu lifetime cover the HWID spoofer?',
    a: 'No. A $150 lifetime key is only for the Apex hack menu. Spoofer lifetime is its own $150 checkout, with a $50 monthly option. Shorter menu time does not roll into lifetime credit.',
    scopes: ['loader', 'hwid-spoofer'],
  },
  {
    id: 'player-esp',
    topic: 'esp',
    icon: 'faqWhatIsEsp',
    q: 'What should I expect from Player ESP squads?',
    a: 'Tagged legends show names, teams, and rough position in your FOV. Add Distance ESP when rotating third parties; trim label count if fights get noisy.',
    scopes: ['loader'],
  },
  {
    id: 'advanced-aimbot',
    topic: 'esp',
    icon: 'faqExternalLoader',
    q: 'First-night Advanced Aimbot settings?',
    a: 'Keep FOV tight, smoothing high, and visibility checks on. Log a few firing-range drills before ranked, then widen FOV only if tracking feels sluggish.',
    scopes: ['loader'],
  },
  {
    id: 'weapon-esp',
    topic: 'esp',
    icon: 'faqWhatIsEsp',
    q: 'When does Weapon ESP pay off?',
    a: 'It prints the opponent’s gun above their box so you know whether to slide in or hold range. Disable it if you already run full skeleton and box clutter.',
    scopes: ['loader'],
  },
  {
    id: 'health-bar',
    topic: 'esp',
    icon: 'faqWhatIsEsp',
    q: 'How should I use Health Bar in ring fights?',
    a: 'Bars stack shield pips and health on tagged players. Drop skeleton thickness or raise distance cutoffs when multiple teams collapse in one POI.',
    scopes: ['loader'],
  },
  {
    id: 'loot-esp',
    topic: 'esp',
    icon: 'faqWhatIsEsp',
    q: 'Loot ESP during zone crunch—worth it?',
    a: 'Yes for death boxes and ground swaps between rotations. Tier filters stop grey guns from covering enemies during endgame scans.',
    scopes: ['loader'],
  },
  {
    id: 'no-recoil',
    topic: 'esp',
    icon: 'faqExternalLoader',
    q: 'No Recoil vs manual control?',
    a: 'The module trims vertical climb on sustained beams. It will not fix whiffed flicks—dial aimbot first, then add light recoil assist for AR/LMG sprays.',
    scopes: ['loader'],
  },
  {
    id: 'javelin-bypass',
    topic: 'safety',
    icon: 'faqBanRisk',
    q: 'What is EA Javelin Bypass on cheatsapexlegends.org?',
    a: 'It means builds are checked against live Javelin before the status note goes GREEN. RED still means wait. It is engineering fit, not a ban waiver.',
    scopes: ['loader'],
  },
  {
    id: 'stream-proof',
    topic: 'esp',
    icon: 'faqExternalLoader',
    q: 'Will Stream Proof hide overlays on stream?',
    a: 'It hides menu and ESP from common capture paths while you see them locally. GPU driver, dual-PC, and OBS scene setups still need a private test.',
    scopes: ['loader'],
  },
  {
    id: 'support-247',
    topic: 'products',
    icon: 'faqAfterBuy',
    q: 'Fastest way to reach 24/7 Support?',
    a: 'Use the Discord invite on the support page with order email, product (menu vs spoofer), and a screenshot of any loader error text.',
    scopes: ['loader', 'hwid-spoofer'],
  },
  {
    id: 'spoofer-scope',
    topic: 'products',
    icon: 'faqProductsPage',
    q: 'Buy the HWID spoofer when…',
    a: `Choose ${hwid} if brand-new accounts lock to one desktop but succeed on a laptop. It will not lift an account-only sanction on the same iron.`,
    scopes: ['hwid-spoofer'],
  },
  {
    id: 'not-dma',
    topic: 'products',
    icon: 'faqExternalLoader',
    q: 'Do I need a DMA board for this key?',
    a: 'No. Checkout delivers a software loader for your own Windows box. DMA hardware is a different SKU and is not included here.',
    scopes: ['loader'],
  },
  {
    id: 'blog-default-1',
    topic: 'blog',
    icon: 'faqBlogDefault1',
    q: 'Do blog posts override the product page list?',
    a: `Guides walk through ideas and link back to ${cheats}. Module names on that product card beat anything written in an article.`,
  },
  {
    id: 'blog-default-2',
    topic: 'blog',
    icon: 'faqBlogDefault2',
    q: 'Article steps fail—what should I send support?',
    a: 'Paste the guide title, your receipt email, and the loader message verbatim. Screenshots beat paraphrasing.',
  },
  {
    id: 'blog-default-3',
    topic: 'blog',
    icon: 'faqBlogDefault3',
    q: 'Are tutorial sliders safe after a Javelin push?',
    a: 'Assume presets age overnight. Read status, then import your saved profile instead of transcribing numbers from the post.',
  },
  {
    id: 'blog-plan-start',
    topic: 'plans',
    icon: 'faqComparePlans',
    q: '31-day or lifetime for a first purchase?',
    a: `Pick 31 days to sample one SKU. ${ALL_PRODUCTS_PLANS_LINE} Credits from a short plan never apply to lifetime, and lifetime on one SKU never unlocks the others.`,
  },
  {
    id: 'blog-plan-upgrade',
    topic: 'plans',
    icon: 'faqLicenseMove',
    q: 'Can I turn a 31-day key into lifetime later?',
    a: 'Lifetime is a fresh checkout on the same product. Prior $35 or $50 payments are not discounted toward the $150 lifetime price.',
  },
  {
    id: 'blog-plan-expire',
    topic: 'plans',
    icon: 'faqAfterBuy',
    q: 'My 31-day window ended—now what?',
    a: 'Access stops at day 31 unless you buy another window or lifetime on that exact product. Lifetime never auto-renews and keys do not hop between products.',
  },
  {
    id: 'blog-plan-support',
    topic: 'plans',
    icon: 'faqBlogDefault2',
    q: 'Refunds if I bought the wrong plan?',
    a: 'Sales complete at checkout. Bans, buyer’s remorse, or playing on an outdated status note are not refundable. We only issue fixes or refunds when we verify a defect on our end—see terms.',
    aHtml: `Sales complete at checkout. Bans, buyer’s remorse, or playing on an outdated status note are not refundable. We only issue fixes or refunds when we verify a defect on our end—see the ${link('terms', '/terms/')}.`,
  },
];

export function getLandingFaqs(): SiteFaqItem[] {
  return siteFaqs.filter((f) =>
    ['status', 'after-buy', 'ban-risk', 'hwid-ban-risk', 'platforms', 'license-move', 'products-page'].includes(f.id),
  );
}

export function getAllFaqs(): SiteFaqItem[] {
  return siteFaqs.filter((f) => f.topic !== 'all');
}

export const SITE_FAQ_SECTION_COPY = {
  eyebrow: 'All topics',
  title: 'Browse by category',
  subtitle: 'Plans, modules, the loader, the spoofer, and setup.',
} as const;

export const SITE_FAQ_FILTER_TOPICS: FaqTopic[] = [
  'all',
  'plans',
  'esp',
  'safety',
  'products',
  'blog',
  'setup',
];

export const CONTEXTUAL_FAQ_SECTION_COPY = {
  eyebrow: 'FAQ',
  title: 'Questions about this page',
  subtitle: 'Answers tied to what you are reading—visit the FAQ page for every topic.',
} as const;

export function faqFilterTopicsForItems(items: SiteFaqItem[]): FaqTopic[] {
  const present = new Set(items.map((item) => item.topic));
  const topics: FaqTopic[] = ['all'];
  for (const topic of SITE_FAQ_FILTER_TOPICS) {
    if (topic !== 'all' && present.has(topic)) topics.push(topic);
  }
  return topics;
}

export function getProductFaqs(slug: string, _kind: 'tier' | 'utility'): SiteFaqItem[] {
  const general = siteFaqs.filter((f) => !f.scopes);
  const scoped = siteFaqs.filter((f) => f.scopes?.includes(slug));
  const combined = [...scoped, ...general];
  const seen = new Set<string>();
  return combined.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function getBlogFaqs(_tag: string, _slug: string): SiteFaqItem[] {
  return siteFaqs.filter(
    (f) => f.id.startsWith('blog-default-') || f.id.startsWith('blog-plan-'),
  );
}

export const compareRows = [
  { feature: 'Player ESP', icon: 'comparePlayerEsp' as const, lite: true, pro: true, elite: true },
  { feature: 'Advanced Aimbot', icon: 'comparePlayerEsp' as const, lite: true, pro: true, elite: true },
  { feature: 'Loot ESP', icon: 'compareZoomHack' as const, lite: true, pro: true, elite: true },
  { feature: 'Stream Proof', icon: 'compareCloudBackup' as const, lite: true, pro: true, elite: true },
];
