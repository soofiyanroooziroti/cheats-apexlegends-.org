import { LOADER_PLANS_LINE } from '../config/loader-pricing';
import { SPOOFER_PLANS_LINE } from '../config/product-plans';
import type { AcquisitionStep, ProductSlide, SystemRequirement } from './product-types';
import type { Block } from './product-locale-types';
import { apexLoaderFeatureGroups } from './apex-loader-feature-groups';

const gameplay = '/images/gameplay';
const products = '/images/products';

/** Cheats product page — full menu screenshots plus in-match capture (uncropped). */
export const apexMenuSlides: ProductSlide[] = [
  {
    src: `${products}/apex-legends-menu-aimbot-full.webp`,
    alt: 'Apex Legends cheat menu Aimbot tab with smoothing, FOV, and target options',
    caption: 'Aimbot',
    captionDesc: 'Advanced Aimbot and No Recoil.',
    width: 1330,
    height: 840,
  },
  {
    src: `${products}/apex-legends-menu-world-full.webp`,
    alt: 'Apex Legends cheat menu World and Loot tab with ESP toggles',
    caption: 'World/Loot',
    captionDesc: 'Weapon ESP and Loot ESP.',
    width: 1330,
    height: 840,
  },
  {
    src: `${products}/apex-legends-menu-visuals-full.webp`,
    alt: 'Apex Legends cheat menu Player Visuals tab with ESP overlay toggles',
    caption: 'Player Visuals',
    captionDesc: 'Player ESP, Box ESP, Skeleton ESP, Health Bar, and Distance ESP.',
    width: 1330,
    height: 840,
  },
  {
    src: `${products}/apex-legends-menu-misc-full.webp`,
    alt: 'Apex Legends cheat menu Misc tab with general, stream-proof, and config options',
    caption: 'Misc / General',
    captionDesc: 'Stream-proof mode, menu keys, and config save/load.',
    width: 1330,
    height: 840,
  },
];

/** Home hero only — gameplay captures (not the product gallery). */
const homeHeroGallery = {
  slide1: {
    src: `${gameplay}/apex-hero-floating-base-esp.webp`,
    alt: 'Apex Legends overlay on floating structures with a green enemy silhouette against the sky',
    caption: 'Long-range tags',
    captionDesc: 'Squad silhouettes on canyon structures.',
  },
  slide2: {
    src: `${gameplay}/apex-hero-bunk-room-wallhack.webp`,
    alt: 'Indoor Apex Legends room with wallhack outlines on players through walls',
    caption: 'Indoor wallhack',
    captionDesc: 'Enemy outlines through interior walls.',
  },
  slide3: {
    src: `${gameplay}/apex-hero-ring-countdown-esp.webp`,
    alt: 'Apex Legends ring countdown with squad distance labels on an industrial map',
    caption: 'Ring pressure',
    captionDesc: 'Squadmates and range readouts before zone damage.',
  },
  slide4: {
    src: `${gameplay}/apex-hero-skyway-player-tags.webp`,
    alt: 'Apex Legends elevated walkway with player ESP names and distance markers',
    caption: 'Skyway ESP',
    captionDesc: 'Player tags across open vertical space.',
  },
  slide5: {
    src: `${gameplay}/apex-hero-ads-target-box-esp.webp`,
    alt: 'First-person Apex Legends aim-down-sights view with boxed enemy and damage numbers',
    caption: 'ADS targeting',
    captionDesc: 'Hitbox box and range on a live target.',
  },
  slide6: {
    src: `${gameplay}/apex-hero-rooftop-squad-esp.webp`,
    alt: 'Apex Legends rooftop fight with multiple player ESP boxes and skeleton lines',
    caption: 'Rooftop squad fight',
    captionDesc: 'Several enemies tagged on a raised platform.',
  },
} as const satisfies Record<string, ProductSlide>;

function homeSlide(...keys: (keyof typeof homeHeroGallery)[]): ProductSlide[] {
  return keys.map((k) => homeHeroGallery[k]);
}

/** Home hero slider only — not the cheats product gallery. */
export const cheatHomeHeroSlides: ProductSlide[] = homeSlide(
  'slide1',
  'slide2',
  'slide3',
  'slide4',
  'slide5',
  'slide6',
);

export const acquisitionSteps: AcquisitionStep[] = [
  {
    num: '01',
    title: 'Check status',
    desc: 'Read the status page after an Apex Legends or Javelin update before you buy. GREEN means the note lists the file to load. RED means wait.',
  },
  {
    num: '02',
    title: 'Pick a plan',
    desc: `${LOADER_PLANS_LINE}. The HWID spoofer uses its own price.`,
  },
  {
    num: '03',
    title: 'Secure checkout',
    desc: 'Complete checkout from the product card. Your license unlocks in the portal with instant delivery.',
  },
  {
    num: '04',
    title: 'Install & verify',
    desc: 'Follow the setup guide, load a conservative preset, and test in a lower-stakes playlist before you use your main profile.',
  },
];

export const utilitySlides = {
  spoofer: [
    {
      src: `${products}/apex-spoofer-hero.webp`,
      alt: 'HWID spoofer for Apex Legends on Windows PC',
      caption: 'HWID spoofer',
      captionDesc: 'Hardware profile rotation before you relaunch Apex Legends.',
      width: 1200,
      height: 1200,
    },
    {
      src: `${products}/apex-spoofer-phoenix-board.webp`,
      alt: 'Phoenix Satano HWID spoofer hardware fingerprint rotation on Windows PC',
      caption: 'HWID rotation',
      captionDesc: 'Disk serials, MAC addresses, and GPU ID rotation workflow.',
      width: 800,
      height: 600,
    },
    {
      src: `${products}/apex-spoofer-phoenix-wh.webp`,
      alt: 'Phoenix WH-Satano spoofer branding for Apex Legends on Windows PC',
      caption: 'Phoenix WH-Satano',
      captionDesc: 'Spoofer build with portal cleaner and compatibility checks.',
      width: 500,
      height: 500,
    },
  ],
} as const;

export const cheatsContent = {
  images: [...apexMenuSlides],
  goodToKnow:
    'Apex Legends and EA Javelin Anticheat update often. Read the status page before you load. GREEN means the note lists this file. RED means wait. Overlay behavior can change after a patch.',
  limitations:
    'Third-party software can violate game terms and lead to bans. You use this software at your own risk. Compatibility can change after a game, anti-cheat, or Windows update. Streamproof does not remove that risk.',
  systemRequirements: [
    {
      icon: 'reqWindows',
      text: 'HVCI ON · CORE ISOLATION ON · TPM ON · SECURE BOOT ON',
    },
    {
      icon: 'reqWindows',
      text: 'Windows 10 and 11',
    },
    {
      icon: 'reqShieldGuide',
      text: 'Latest Apex Legends PC client',
    },
  ] as SystemRequirement[],
  featureGroups: apexLoaderFeatureGroups,
  overview: {
    title: 'A Windows menu for Apex Legends',
    paragraphs: [
      'One license covers Player ESP, Advanced Aimbot, Weapon ESP, Health Bar, Distance ESP, Box ESP, Skeleton ESP, Loot ESP, No Recoil, EA Javelin Bypass, Stream Proof, and 24/7 Support on every plan.',
      `Read the status page before you load. ${LOADER_PLANS_LINE}.`,
    ],
  },
  body: [
    { type: 'h2', text: 'Modules included' },
    {
      type: 'p',
      text: 'Twelve modules on one license. Open the feature list on this page for every name and short note.',
    },
    { type: 'h2', text: 'Plans' },
    {
      type: 'p',
      text: 'The 31-day plan is $35. Lifetime is $150 once. About four 31-day renewals at $35 equal lifetime.',
    },
  ] as Block[],
};

export const spooferContent = {
  images: [...utilitySlides.spoofer],
  goodToKnow:
    'HWID tools change how your PC fingerprint appears. They do not clear an account-only penalty. Read the portal notes before you launch Apex Legends again.',
  limitations:
    'Spoofing carries technical risk and may violate game terms. Results vary by ban type and driver setup. Use only on systems you own.',
  systemRequirements: [
    { icon: 'reqWindows', text: 'Windows 10 or 11 64-bit with administrator rights.' },
    { icon: 'reqRestorePoint', text: 'Create a restore point before running hardware tools.' },
    { icon: 'reqWifi', text: 'Stable internet for activation and verification steps.' },
  ] as SystemRequirement[],
  fullFeatures: [
    'Hardware spoofer with cleaner',
    'Disk serial and MAC rotation',
    'GPU ID profile tools',
    'Compatibility scan',
    'Verification checklist',
    'Portal step-by-step workflow',
    'Discord setup support',
  ],
  overview: {
    title: 'HWID recovery workflow',
    paragraphs: [
      'HWID Spoofer is a separate key for a hardware flag. It rotates disk, MAC, and GPU identifiers on a PC you own. It is not included with the menu.',
      `${SPOOFER_PLANS_LINE}. It does not fix an account-only restriction on the same machine.`,
    ],
  },
  body: [
    { type: 'h2', text: 'When to use it' },
    {
      type: 'p',
      text: 'Use when fresh accounts fail on one PC but work elsewhere—not for account-only bans. Pair with conservative cheat presets after verification.',
    },
    { type: 'h2', text: 'Plans' },
    {
      type: 'p',
      text: SPOOFER_PLANS_LINE,
    },
  ] as Block[],
};
