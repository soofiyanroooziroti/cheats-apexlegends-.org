import type { Translations } from './types';
import { APEX_MENU_FEATURES } from '../data/apex-menu-features';
import { apexModuleNames } from '../data/apex-feature-display';
import { PRIMARY_CHECKOUT_PATH } from '../config/checkout';
import { LOADER_PLANS_LINE, LOADER_PLANS_SHORT } from '../config/loader-pricing';
import { ALL_PRODUCTS_PLANS_LINE, SPOOFER_PLANS_SHORT } from '../config/product-plans';
import { PRODUCT_BASE } from '../config/site';
import { productPath } from '../utils/path-core';

const productBase = PRODUCT_BASE;
const featuresHref = `${productPath('loader')}#features`;

export const en: Translations = {
  site: {
    name: 'Apex cheats',
    domain: 'cheatsapexlegends.org',
    title: 'Apex cheats',
    description:
      'Targeting, squad overlays, loot on the map, and profile tools for Apex Legends on Windows PC. USD pricing.',
    discord: PRIMARY_CHECKOUT_PATH,
  },
  nav: [
    { href: '/', label: 'Home' },
    { href: `${productBase}`, label: 'Products' },
    { href: featuresHref, label: 'Features' },
    { href: '/blog/', label: 'Blog' },
    { href: '/forum/', label: 'Forum' },
    { href: '/faq/', label: 'FAQ' },
    { href: '/support/', label: 'Support' },
  ],
  headerNavLabels: {
    home: 'Home',
    products: 'Store',
    features: 'Features',
    blog: 'Blog',
    forum: 'Forum',
    faq: 'FAQ',
    support: 'Help',
  },
  navMore: 'More',
  navShort: {
    home: 'Home',
    products: 'Products',
    features: 'Features',
    blog: 'Blog',
    forum: 'Forum',
    faq: 'FAQ',
    support: 'Support',
  },
  hero: {
    status: 'Apex Legends — read status before you inject',
    eyebrow: 'Windows PC · Worldwide',
    titleLine1: 'Apex cheats for Windows PC',
    titleLine2: '',
    subtitle: `These apex cheats ship Player ESP, Advanced Aimbot, Loot ESP, No Recoil, EA Javelin Bypass, and Stream Proof on one Windows license. ${LOADER_PLANS_LINE}.`,
    ctaPrimary: 'View products',
    ctaDiscord: 'Buy now',
    modesLabel: 'Modules',
    modes: [...apexModuleNames],
    marqueeAria: 'Features and platform support',
    metrics: [
      { label: 'Anti-cheat', strong: 'EA Javelin' },
      { label: 'Platform', strong: 'Windows PC' },
      { label: 'Plans', strong: LOADER_PLANS_SHORT },
      { label: 'Support', strong: '24/7' },
    ],
  },
  features: {
    eyebrow: 'Features',
    title: 'Twelve modules on one license',
    subtitle: 'Everything included in one license.',
    subtitleLead: '',
    subtitleLinkLabel: '',
    subtitleTail: '',
    seeAllLabel: 'See all features',
    items: [
      { title: 'Player ESP', subtitle: 'Squad and enemy legends with labels in your line of sight.' },
      { title: 'Advanced Aimbot', subtitle: 'Smooth aim assist with FOV and visibility checks in gunfights.' },
      { title: 'Weapon ESP', subtitle: 'See which weapon a legend is holding before you push.' },
      { title: 'Health Bar', subtitle: 'Shield and health bars above targets during rotates.' },
      { title: 'Distance ESP', subtitle: 'Meters to each marked player for range calls.' },
      { title: 'Box ESP', subtitle: 'Corner boxes on legends for quick tracking through cover.' },
      { title: 'Skeleton ESP', subtitle: 'Bone lines when you need posture readouts up close.' },
      { title: 'Loot ESP', subtitle: 'Ground loot markers and tier filters between zone pulls.' },
      { title: 'No Recoil', subtitle: 'Recoil helpers for sustained fire with ARs and SMGs.' },
      { title: 'EA Javelin Bypass', subtitle: 'Built for the live PC client with Javelin active—ban risk remains.' },
      { title: 'Stream Proof', subtitle: 'Overlay mode aimed at capture apps; not guaranteed on every setup.' },
      { title: '24/7 Support', subtitle: 'Discord help for loader keys, checkout, and portal access.' },
    ],
  },
  whyUs: {
    eyebrow: 'Why us',
    title: 'One menu on every plan — updates track the season',
    subtitle:
      `One cheat and one HWID spoofer. ${ALL_PRODUCTS_PLANS_LINE} Account action is still possible under Javelin.`,
    usLabel: 'Apex cheats',
    otherLabel: 'Typical provider',
    rows: [
      {
        title: 'Loader refresh after patches',
        desc: 'Visit cheatsapexlegends.org after an Apex Legends or Javelin client change before you run the loader.',
      },
      {
        title: 'Aim sliders stay separate',
        desc: 'FOV, smoothing, bone, and visibility check are independent. Adjust one knob so you know what moved.',
      },
      {
        title: 'Setup help that matches the case',
        desc: 'Support walks through the Windows loader, saved profiles, and whether you need the menu key or the spoofer key.',
      },
      {
        title: 'Two checkouts, two keys',
        desc: 'The hack menu and the HWID spoofer never share a cart. Lifetime on the menu does not bundle the spoofer.',
      },
      {
        title: 'Profiles on both plans',
        desc: 'All twelve modules sit on one license. The 31-day and lifetime tiers open the same loader build.',
      },
      {
        title: 'Hardware flags need the spoofer',
        desc: 'When a PC cannot register fresh accounts, that is the spoofer product—not something bundled with the menu key.',
      },
    ],
    metrics: [
      {
        value: 'Javelin',
        title: 'Check after a patch',
        desc: 'Re-read the status label after Apex Legends or Javelin ships before you inject.',
      },
      {
        value: '2',
        title: 'Plans on the menu',
        desc: `${LOADER_PLANS_LINE}. The same loader on both tiers.`,
      },
      {
        value: '2',
        title: 'Separate products',
        desc: 'Apex cheats menu and HWID spoofer. Each ships its own license.',
      },
    ],
  },
  setup: {
    eyebrow: 'Setup guide',
    titleLead: 'From payment to your first drop in',
    titleHighlight: 'three quick steps',
    intro:
      'Flow is status → checkout → portal loader. Scan the status page after Javelin or an Apex Legends update before you open the game.',
    ctaPrimary: 'View products',
    ctaSecondary: 'Setup FAQ',
    ctaPrimaryHref: productBase,
    ctaSecondaryHref: '/faq/',
    statusStrip: {
      aceStatusCta: 'Check status',
      aceStatusHref: '/status/',
      perks: [
        { icon: 'instantDelivery', label: 'Instant delivery' },
        { icon: 'support247', label: '24/7 support' },
        { icon: 'refresh', label: 'Lifetime updates' },
      ],
    },
    steps: [
      {
        step: 'Step 1',
        title: 'Portal access and loader download',
        desc: 'Finish checkout, sign into the operator portal, and grab the current Windows loader from your dashboard.',
      },
      {
        step: 'Step 2',
        title: 'Load and tune modules',
        desc: 'Start the loader, then enable Player ESP, aim tuning, loot markers, and stream proof one module at a time.',
      },
      {
        step: 'Step 3',
        title: 'Confirm status, then play',
        desc: 'Make sure the status banner reads GREEN for this build, then launch Apex Legends.',
      },
    ],
  },
  compatibility: {
    eyebrow: 'Platform support',
    title: 'Built for modern Windows rigs.',
    subtitle: 'Revisit the status page after Apex Legends or Javelin changes before you inject.',
    items: ['Windows 10 & 11', 'Intel or AMD', 'HVCI on', 'Core isolation on', 'TPM on', 'Secure boot on', 'Discord support', 'Config save'],
  },
  cheats: {
    eyebrow: 'Game cheat',
    title: 'Hack menu for Apex',
    subtitle: 'Targeting, squad overlays, world loot, and misc profiles on one license.',
    viewAll: 'View details',
    explore: 'Explore',
    items: [
      {
        badge: 'Active',
        tier: 'Full suite',
        name: 'Apex hack',
        title: 'Apex hack menu',
        desc: 'Windows overlay with targeting controls, squad readouts, loot on the map, and saved profile slots.',
        features: ['Box ESP', 'No Recoil', 'Stream Proof'],
        more: 9,
        href: `${productBase}loader/`,
        variant: 'popular',
      },
    ],
  },
  products: {
    eyebrow: 'Products',
    title: 'Apex hack for PC',
    subtitle:
      'Apex hack: $35 for 31 days or $150 lifetime. Apex spoofer: $50 for 31 days or $150 lifetime.',
    viewAll: 'View details',
    get: 'Buy now',
    explore: 'Explore',
    items: [
      {
        badge: 'Active',
        category: 'HWID spoofer',
        title: 'Apex spoofer',
        subtitle: 'Apex spoofer for locked hardware',
        desc: 'HWID spoofer with cleaner—refresh disk, MAC, and GPU identifiers before you queue again after a hardware flag on Apex.',
        features: [
          'Disk, MAC, and GPU ID refresh',
          'Fingerprint scan before you run',
          'Checklist after each rotation',
          'Portal steps with setup help',
        ],
        more: 4,
        href: `${productBase}hwid-spoofer/`,
      },
    ],
  },
  blog: {
    eyebrow: 'Blog',
    title: 'Guides and updates',
    subtitle: 'Season notes, overlay tuning, Javelin patch write-ups, and plan comparisons.',
    latestTitle: 'Latest Apex Legends guides',
    latestSubtitle: 'Filter by topic or sort for setup walkthroughs, module deep-dives, and patch-day reminders.',
    filterAll: 'All articles',
    sortLabel: 'Sort by',
    sortNewest: 'Newest first',
    sortOldest: 'Oldest first',
    sortShortRead: 'Shortest read',
    sortLongRead: 'Longest read',
    emptyFilter: 'No articles match this filter.',
    emptyCatalog: 'No guides are listed in this view. Open a topic filter or the product page.',
    viewAll: 'View all articles',
    read: 'Read',
    items: [],
  },
  toolkit: {
    eyebrow: 'Software',
    title: 'Twelve modules on one license',
    subtitle: 'Same names on the homepage, product page, and loader feature list.',
    items: APEX_MENU_FEATURES.map((feature, index) => ({
      num: String(index + 1).padStart(2, '0'),
      label: feature.name,
      title: feature.name,
      desc: feature.desc,
    })),
  },
  workflow: {
    eyebrow: 'How it works',
    badge: '4 easy steps',
    titleBefore: 'From status banner to',
    titleHighlight: 'saved config.',
    subtitle: 'Short path from the homepage status note to checkout.',
    ctaLabel: 'View products',
    ctaHref: productBase,
    ctaSecondary: 'Setup FAQ',
    ctaSecondaryHref: '/faq/',
    items: [
      {
        num: '01',
        phase: 'Before purchase',
        title: 'Read the status banner',
        desc: 'GREEN lists the file you can load. RED means hold. Check again after Apex Legends or Javelin updates.',
      },
      {
        num: '02',
        phase: 'Checkout',
        title: 'Pick your product',
        desc: `Menu: ${LOADER_PLANS_SHORT}. HWID Spoofer: ${SPOOFER_PLANS_SHORT}. Different keys.`,
      },
      {
        num: '03',
        phase: 'Loader',
        title: 'Download and launch',
        desc: 'Pull the build from the portal. Keep HVCI, core isolation, TPM, and secure boot enabled.',
      },
      {
        num: '04',
        phase: 'In-game',
        title: 'Store your config',
        desc: 'When the cone and loot labels feel right, save the profile from the misc tab.',
      },
    ],
  },
  fieldNotes: {
    eyebrow: 'Field notes',
    title: 'Tuned for Apex Legends on Windows PC.',
    items: [
      { num: '01', title: 'Patch-day habit', desc: 'Open the status page after Javelin or a client push. Yesterday’s green banner is not today’s build.' },
      { num: '02', title: 'One control at a time', desc: 'Move FOV, smooth, or max distance separately so you know what caused pull or screen noise.' },
      { num: '03', title: 'Keys stay separate', desc: 'Menu checkout and spoofer checkout do not merge. Lifetime on one product does not unlock the other.' },
    ],
  },
  support: {
    eyebrow: 'Support',
    title: 'Apex cheats support',
    subtitle: 'Tell us what you need before or after checkout.',
    channels: [
      {
        icon: 'users',
        title: 'Questions before you pay',
        desc: 'Ask about the hack menu or HWID spoofer before checkout.',
        linkLabel: 'Start checkout',
        href: PRIMARY_CHECKOUT_PATH,
      },
      {
        icon: 'messageCircle',
        title: 'Community forum',
        desc: 'Loader setup, aim tuning, overlays, and plan picks—with marked dev replies.',
        linkLabel: 'Open the forum',
        href: '/forum/',
      },
      {
        icon: 'navFaq',
        title: 'Read the FAQ',
        desc: 'Compatibility, bans, and install order—before you buy.',
        linkLabel: 'View all FAQ',
        href: '/faq/',
      },
      {
        icon: 'clock',
        title: 'Live operators',
        desc: 'Discord staff on shift around the clock.',
        linkLabel: 'Open contact page',
        href: '/support/',
      },
    ],
    ticketTitle: 'Include in your ticket',
    ticketItems: [
      { title: 'Order email', desc: 'The address you used at checkout on cheatsapexlegends.org.' },
      { title: 'Platform', desc: 'Windows 10 or 11, and whether HVCI, core isolation, TPM, and secure boot stay on.' },
      { title: 'Error detail', desc: 'Paste the loader error text exactly—no summaries.' },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Clear answers before you pay.',
    subtitle: 'Hardware, bans, and access—without marketing fluff.',
    items: [
      {
        num: '01',
        q: 'Where do I see if the loader is current?',
        a: 'Use the status page on cheatsapexlegends.org after Apex Legends or Javelin updates. GREEN means load. RED means wait.',
      },
      {
        num: '02',
        q: 'What happens right after purchase?',
        a: 'Checkout sends you to the portal for the loader. Save a profile after tuning aim and overlays. Leave HVCI, core isolation, TPM, and secure boot on.',
      },
      {
        num: '03',
        q: 'Can my account get banned?',
        a: 'Yes. Javelin can act on the account. Nothing here promises a clean session. Streamproof does not remove ban risk.',
      },
      {
        num: '04',
        q: 'Which OS builds work?',
        a: 'Windows 10 or 11 on Intel or AMD with HVCI, core isolation, TPM, and secure boot enabled. macOS and Linux are unsupported.',
      },
      {
        num: '05',
        q: 'Can I use my key on another PC?',
        a: 'Hardware locks are handled by the HWID Spoofer, sold on its own. Open support with your order email if you need to move access.',
      },
      {
        num: '06',
        q: 'Where are both products listed?',
        a: `${ALL_PRODUCTS_PLANS_LINE} Compare them on the products page.`,
      },
    ],
  },
  footer: {
    tagline: 'Apex cheats and HWID spoofer for Windows PC. cheatsapexlegends.org',
    explore: 'Explore',
    exploreLinks: [
      { href: '/products/apex-cheats/loader/#features', label: 'Feature overview', ariaLabel: 'Features' },
      { href: '/products/apex-cheats/loader/', label: 'Apex hack menu', ariaLabel: 'Apex hack menu' },
      { href: '/products/apex-cheats/', label: 'All products', ariaLabel: 'Products' },
      { href: '/blog/', label: 'Read patch guides', ariaLabel: 'Blog' },
      { href: '/faq/', label: 'Pre-purchase FAQ', ariaLabel: 'FAQ' },
    ],
    support: 'Support',
    legal: 'Legal',
    moreSites: 'More sites',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    about: 'About',
  },
  legalPages: {
    about: {
      title: 'About this store',
      description:
        'cheatsapexlegends.org sells an Apex Legends hack menu and an HWID spoofer, with setup notes and honest Javelin risk.',
      sections: [
        {
          heading: 'Who we are',
          paragraphs: [
            'cheatsapexlegends.org offers a Windows menu for Apex Legends plus a standalone HWID spoofer. The menu covers squad overlays, loot cues, skeleton lines, health and shield bars, aim tuning, and an optional streamproof layer.',
            `${ALL_PRODUCTS_PLANS_LINE} A lifetime menu key does not include the spoofer license.`,
            'Names on this site describe our products only—they are not publisher endorsements. Delivery is a portal download for Windows 10 or 11. Keep HVCI, core isolation, TPM, and secure boot on, and load only when the site matches the live client.',
          ],
        },
        {
          heading: 'What we publish',
          paragraphs: [
            'The [menu page](/products/apex-cheats/loader/) lists module names and PC requirements: Windows 10 or 11, Intel Core i5 or AMD Ryzen 5 class hardware, with HVCI, core isolation, TPM, and secure boot left enabled. The [products page](/products/apex-cheats/) compares the menu with the [HWID Spoofer](/products/apex-cheats/hwid-spoofer/).',
            'The [blog](/blog/) covers overlay tuning, Javelin patch days, and when a hardware flag needs the spoofer instead of the menu. The [forum](/forum/) hosts the same topics with marked developer replies. Read the [terms](/terms/) before paying—sales are final, including bans.',
            'EA Javelin Anticheat can still act on accounts. We do not guarantee safety after the next patch. Re-check this site after client updates before you inject. If the build is not listed as current, keep the loader closed.',
            'Homepage status notes say whether the published loader matches the client. They are not a promise that Javelin will ignore the software. When unsure, stay offline and read the related guide before you queue.',
          ],
        },
        {
          heading: 'Support',
          paragraphs: [
            'Loader faults, license moves, and billing questions go through the [support page](/support/). Include order email, Windows version, and exact loader output. Do not disable HVCI, core isolation, TPM, or secure boot because another game’s chat said to.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      description:
        'How cheatsapexlegends.org handles analytics, cookies, and contact data.',
      sections: [
        {
          heading: 'Information we collect',
          paragraphs: [
            'We may collect standard web analytics such as page views, device type, browser, and approximate region through Google Analytics when enabled. Checkout and license delivery happen on external checkout pages. We do not store payment card data on cheatsapexlegends.org.',
          ],
        },
        {
          heading: 'How we use data',
          paragraphs: [
            'Analytics show which guides and product pages help visitors so we can improve content and fix broken links. Support tickets may keep the email and message you send until the ticket closes.',
          ],
        },
        {
          heading: 'Cookies',
          paragraphs: [
            'We use minimal cookies required for analytics. You can block cookies in your browser; core site pages still load without them.',
          ],
        },
        {
          heading: 'Support',
          paragraphs: [
            'Privacy questions belong on the Support page. Purchase and refund rules live in our Terms & Conditions.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      description:
        'Purchase, license, refund, and use terms for products sold on cheatsapexlegends.org.',
      sections: [
        {
          heading: 'Agreement',
          paragraphs: [
            'Last updated: October 2026. By browsing cheatsapexlegends.org or buying any product here, you agree to these Terms & Conditions and our Privacy Policy.',
          ],
        },
        {
          heading: 'What you purchase',
          paragraphs: [
            `We sell an Apex Legends menu and an HWID spoofer. ${ALL_PRODUCTS_PLANS_LINE} Each product is a separate license.`,
            'Feature lists on product pages reflect what is included at purchase time. Modules may shift when Apex Legends or Javelin updates. A lifetime menu key does not bundle the spoofer.',
          ],
        },
        {
          heading: 'Checkout and delivery',
          paragraphs: [
            'Payment and license delivery run on external checkout pages. cheatsapexlegends.org does not process or store card numbers.',
            'After purchase, use the portal link from your order to download the current loader before launching Apex Legends. Leave HVCI, core isolation, TPM, and secure boot on.',
          ],
        },
        {
          heading: 'License use',
          paragraphs: [
            'Licenses are for personal use. Do not share loader files, portal logins, or keys. Hardware-ID blocks require a separate HWID Spoofer purchase.',
          ],
        },
        {
          heading: 'Refunds and purchases',
          paragraphs: [
            'All sales finalize at checkout. We do not refund change-of-mind orders, account bans, Javelin penalties, or issues from ignoring setup notes or loading while the site is out of date.',
            'If the product fails on a supported rig—Windows 10 or 11 with HVCI, core isolation, TPM, and secure boot on, using the current portal loader—contact Support with order email, Windows version, and exact loader text.',
            'We may offer a fix, replacement access, or partial/full refund when we confirm a fault on our side. Approval is not guaranteed for every request.',
          ],
        },
        {
          heading: 'Availability and risk',
          paragraphs: [
            'Third-party tools for Apex Legends can break when the game or EA Javelin Anticheat updates. You accept all risk, including possible account action.',
            'Read the homepage status banner each session. Do not queue on a main account while modules are offline or misaligned after a patch.',
          ],
        },
        {
          heading: 'Changes',
          paragraphs: [
            'We may revise these terms. The “Last updated” date reflects changes. Continued use after updates means you accept the new text.',
          ],
        },
        {
          heading: 'Support',
          paragraphs: [
            'Terms, billing, or loader help: use the Support page. See the Privacy Policy for how we handle site data.',
          ],
        },
      ],
    },
    support: {
      title: 'Apex cheats support',
      description:
        'Loader, HWID spoofer, and checkout help for cheatsapexlegends.org.',
    },
  },
  productCatalog: {
    searchHeading: 'Browse products and plans',
    utilityCategory: 'Utility',
    buyLoader: 'Buy the loader',
    buyHwidSpoofer: 'Buy the HWID spoofer',
  },
  utilitiesPage: {
    title: 'HWID utility',
    subtitle: 'The HWID spoofer is its own checkout when a hardware flag blocks fresh accounts on one machine.',
    breadcrumb: 'HWID utility',
    tableAria: 'Utility comparison',
    columnUtility: 'Utility',
    columnBestFor: 'Best for',
    columnProductPage: 'Product page',
    includesLabel: 'Includes:',
    backToProducts: 'Back to products',
    viewCategory: 'View {category}',
    viewDetailsFallback: 'details',
    schemaName: 'HWID utility',
    useCases: {
      'hwid-spoofer':
        'New rig or hardware flag after a ban—change how the PC fingerprints before a new Apex account.',
    },
  },
  sectionSearch: {
    blogHeading: 'Filter guides by topic',
    supportHeading: 'Browse help topics',
  },
  ui: {
    skipLink: 'Skip to main content',
    browseCheats: 'Try Now',
    browseCheatsMobile: 'Start checkout',
    homeAria: 'Apex cheats home',
    checkoutAria: 'Start checkout',
    discordAria: 'Buy Apex cheats',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    themeLight: 'Switch to light mode',
    themeDark: 'Switch to dark mode',
    searchPlaceholder: 'Search products, guides, FAQ…',
    searchEmpty: 'Type to search the site.',
    searchNoResults: 'No results. Try another term.',
    searchCloseAria: 'Close search',
    searchTitle: 'Search',
    searchOpenAria: 'Search site',
    contactSupport: 'Contact support',
    searchResultsAria: 'Search results',
    searchHintNavigate: 'navigate',
    searchHintOpen: 'open',
    searchHintClose: 'close',
    searchKeyboardEnter: 'Enter',
    searchKeyboardEsc: 'Esc',
    primaryNavAria: 'Primary',
    mobileNavAria: 'Mobile',
    shareNavAria: 'Share this page',
    shareOnX: 'Share on X',
    shareOnFacebook: 'Share on Facebook',
    shareOnReddit: 'Share on Reddit',
    prevImage: 'Previous image',
    nextImage: 'Next image',
    heroSlidesAria: 'Hero slides',
    slideLabel: 'Slide {n}',
    prevScreenshot: 'Previous screenshot',
    nextScreenshot: 'Next screenshot',
    loading: 'Loading',
  },
};

/** Core English copy — full site bundle is buildEnBundle() in en-bundle.ts. */
export type EnSource = typeof en;
