export interface ForumComment {
  author: string;
  age: string;
  score: number;
  body: string;
  developer?: boolean;
  replies?: ForumComment[];
}

export interface ForumPost {
  slug: string;
  category: string;
  categoryTone: 'purple' | 'blue' | 'green' | 'orange';
  title: string;
  excerpt: string;
  /** Meta description. Cards keep the shorter excerpt. */
  description: string;
  author: string;
  age: string;
  date: string;
  commentsCount: number;
  upvotes: number;
  flair?: string;
  body: string[];
  comments: ForumComment[];
  sourceTitle?: string;
  sourcePath?: string;
  /** Answered threads that should show a closed badge. New patch threads stay open. */
  closed?: boolean;
}

export const FORUM_DEVELOPER = 'SupportStaff';

export const forumCategories = [
  { name: 'General', tone: 'purple', icon: 'users' },
  { name: 'Guides & Builds', tone: 'blue', icon: 'navBlog' },
  { name: 'Patch Talk', tone: 'orange', icon: 'refresh' },
  { name: 'Community', tone: 'green', icon: 'messageCircle' },
] as const;

/** Stable filter keys — always derived from English category names. */
export const FORUM_CATEGORY_KEYS: Record<string, string> = {
  General: 'general',
  'Guides & Builds': 'guidesbuilds',
  'Patch Talk': 'patchtalk',
  Community: 'community',
};

export function forumCategoryFilterKey(category: string): string {
  return FORUM_CATEGORY_KEYS[category] ?? category.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function countComments(comments: ForumComment[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + (comment.replies ? countComments(comment.replies) : 0),
    0,
  );
}

function withCounts(post: Omit<ForumPost, 'commentsCount'>): ForumPost {
  return { ...post, commentsCount: countComments(post.comments) };
}

export function forumLastReply(comments: ForumComment[]): { author: string; age: string } | null {
  let last: ForumComment | null = null;
  const walk = (list: ForumComment[]) => {
    for (const comment of list) {
      last = comment;
      if (comment.replies?.length) walk(comment.replies);
    }
  };
  walk(comments);
  return last ? { author: last.author, age: last.age } : null;
}

/** Seeded discussions — English source. Dates stay inside the Sep 29–Nov 10 window and are not the same day. */
const rawPosts: Array<Omit<ForumPost, 'commentsCount'>> = [
  {
    slug: 'loader-stuck-after-cipher-patch',
    category: 'Patch Talk',
    categoryTone: 'orange',
    title: 'Loader stuck after the Cipher patch',
    excerpt: 'Season 31 dropped and the loader just sits there. Did I brick it or is the file old?',
    description:
      'After the Season 31 Cipher patch the loader would not start. Staff pointed at the status note and a fresh portal file. OP says it is working again.',
    author: 'WraithMain_jay',
    age: '6h ago',
    date: 'Sep 30, 2026',
    upvotes: 41,
    flair: 'Solved',
    closed: true,
    body: [
      'yo cipher patch hit and my loader just spins. was fine yesterday. i did not touch hvci or secure boot.',
      'status page still said green from before the patch. am i cooked or do i just wait for a new file? 😭',
    ],
    comments: [
      {
        author: 'ApexDev_K',
        age: '4h ago',
        score: 28,
        developer: true,
        body: 'That green note was for the old client. After Cipher, read status again. If it says wait, do not keep launching. When it lists a new file, grab it from the portal and load that one. Same key. Do not turn security features off to force it.',
        replies: [
          {
            author: 'WraithMain_jay',
            age: '2h ago',
            score: 11,
            body: 'new file was up. launched clean. working 100% in pubs. thanks king',
          },
        ],
      },
      {
        author: 'octane_otp',
        age: '3h ago',
        score: 9,
        body: 'same. old file was the problem not the key. refreshed portal and it opened.',
      },
    ],
    sourceTitle: 'Security Deep Dive: Navigating the Apex Anticheat Systems',
    sourcePath: '/blog/apex-anticheat/',
  },
  {
    slug: 'refund-if-menu-does-not-launch',
    category: 'General',
    categoryTone: 'purple',
    title: 'Refund if the menu does not launch?',
    excerpt: 'Before I buy: if it does not open on my pc do I get my money back?',
    description:
      'Pre-buy refund question. Sales are final. A fix or refund only happens if support confirms a fault on our side.',
    author: 'horizon_tea',
    age: '1d ago',
    date: 'Oct 3, 2026',
    upvotes: 63,
    flair: 'Pre-buy',
    body: [
      'thinking about the 31 day key. simple question before i pay.',
      'if the menu does not launch on my pc, is that an auto refund? or do i just lose the money. be real with me.',
    ],
    comments: [
      {
        author: 'SupportStaff',
        age: '20h ago',
        score: 47,
        developer: true,
        body: 'Checkout is final. We do not refund because you changed your mind, got an account penalty, or loaded while status said wait. If it fails on a supported pc (Windows 10 or 11, HVCI, core isolation, TPM, and secure boot left on, current portal file), email support with the order email, Windows version, and the exact loader text. If we confirm the fault is on our side we can fix it, replace access, or refund. That is not a yes for every ticket.',
        replies: [
          {
            author: 'horizon_tea',
            age: '16h ago',
            score: 8,
            body: 'ok that is clear. i will check the terms page before i buy. appreciate the straight answer.',
          },
        ],
      },
      {
        author: 'pathy_clips',
        age: '12h ago',
        score: 6,
        body: 'read terms first fr. the status note matters. do not queue on red.',
      },
    ],
    sourceTitle: 'License terms, refunds, and acceptable use',
    sourcePath: '/terms/',
  },
  {
    slug: 'boxes-eating-the-screen',
    category: 'Guides & Builds',
    categoryTone: 'blue',
    title: 'Boxes eating my whole screen in a POI',
    excerpt: 'Turned every visual on and now I cannot see the door. What do you actually leave on?',
    description:
      'Player boxes stacked in a busy POI. A short preset (box plus health, loot off in the fight) cleared the screen. OP says it is working.',
    author: 'bangalore_bench',
    age: '8h ago',
    date: 'Oct 8, 2026',
    upvotes: 54,
    flair: 'Solved',
    closed: true,
    body: [
      'first session i enabled box, skeleton, health, distance, weapon, loot. looked cool for 2 seconds then a building fight was unreadable.',
      'what do you actually keep on so you can still see the model? i am lost ngl.',
    ],
    comments: [
      {
        author: 'SiteMod_Nia',
        age: '6h ago',
        score: 33,
        developer: true,
        body: 'Drop it to a box and a health bar for the fight. Leave loot labels off until you are on a bin. Distance is optional on rotates, not inside the building. Save that as one config so you are not clicking twelve toggles mid round.',
        replies: [
          {
            author: 'bangalore_bench',
            age: '4h ago',
            score: 14,
            body: 'box + health only. i can see heads again. working 100% 🔥',
          },
        ],
      },
      {
        author: 'crypto_drone7',
        age: '5h ago',
        score: 7,
        body: 'loot on during the drop, off when i hear a door. that split helped me more than another color.',
      },
    ],
    sourceTitle: 'Using Apex ESP Without Drowning in Your Own UI',
    sourcePath: '/blog/apex-esp-guide/',
  },
  {
    slug: 'new-logins-die-on-one-pc',
    category: 'General',
    categoryTone: 'purple',
    title: 'New logins die on this PC only',
    excerpt: 'Fresh accounts fail on my desktop and work on a laptop. Is that an ID ban?',
    description:
      'New logins fail on one desktop and work on a laptop. Staff say that is not a confirmed ID ban. In most cases there is no ID ban.',
    author: 'loba_loot',
    age: '5h ago',
    date: 'Oct 12, 2026',
    upvotes: 37,
    flair: 'Question',
    body: [
      'old account on my laptop still queues. brand new logins on this desktop die early, sometimes before a real match.',
      'is that a confirmed id ban? do i buy the spoofer or is the menu supposed to fix the login?',
    ],
    comments: [
      {
        author: 'ApexDev_K',
        age: '3h ago',
        score: 29,
        developer: true,
        body: 'That pattern is the machine, not one email. It is not a confirmed ID ban by itself. In most cases there is no ID ban. The menu does not change disk or network ids. The spoofer is a separate key for a fingerprint problem on a pc you own. It does not undo a penalty that already sits on one account, and it is not an easy bypass claim.',
        replies: [
          {
            author: 'loba_loot',
            age: '2h ago',
            score: 9,
            body: 'tried a second pc first like you said. laptop is fine, desktop is the weird one. not treating it like a magic undo. thanks.',
          },
        ],
      },
    ],
    sourceTitle: 'What Does an HWID Spoofer Do and Why It Matters for Account Safety',
    sourcePath: '/blog/hwid-spoofer-explained/',
  },
  {
    slug: 'r301-spray-still-climbs',
    category: 'Guides & Builds',
    categoryTone: 'blue',
    title: 'Spray still climbs on the R-301',
    excerpt: 'No Recoil is on but the last half of the mag still walks up. Did I set it wrong?',
    description:
      'R-301 still climbed late in the mag. Compare first bullets and the tail, then ease the slider. OP says the hold is working.',
    author: 'gibby_bubble',
    age: '9h ago',
    date: 'Oct 17, 2026',
    upvotes: 48,
    flair: 'Solved',
    closed: true,
    body: [
      'no recoil on, still the r-301 climbs after like half a mag. first bullets feel ok then it walks.',
      'am i supposed to burst or is the slider just low? not trying to build a macro, just the menu option.',
    ],
    comments: [
      {
        author: 'ApexDev_K',
        age: '7h ago',
        score: 36,
        developer: true,
        body: 'Shoot one mag at a wall with no mouse correction. Look at the opening, the middle, and the tail. A vertical slider shortens the climb. It does not erase a sideways walk at the end, so burst before the tail if it still slides. If the first shots drop under the crosshair, the slider is too high. This is not a jitter macro and not an adapter.',
        replies: [
          {
            author: 'gibby_bubble',
            age: '5h ago',
            score: 12,
            body: 'eased it off a notch and i burst the tail. beams feel normal now. working 100%.',
          },
        ],
      },
    ],
    sourceTitle: 'Analyzing Weapon Spray Patterns and No Recoil Adjustments',
    sourcePath: '/blog/no-recoil-spray-patterns/',
  },
  {
    slug: 'vod-showed-the-menu',
    category: 'Community',
    categoryTone: 'green',
    title: 'Stream showed my menu on the VOD',
    excerpt: 'Went live and chat saw the menu. Stream proof was on. What did I set wrong?',
    description:
      'A VOD showed the menu even with Stream Proof on. The scene was display capture. Switching to game capture and checking a local recording fixed it.',
    author: 'pathy_clips',
    age: '1d ago',
    date: 'Oct 23, 2026',
    upvotes: 72,
    flair: 'Solved',
    closed: true,
    body: [
      'stream proof on. i still saw the menu in my own recording. chat definitely saw it too. embarrassing.',
      'scene is just the whole monitor because that was easier. is that why?',
    ],
    comments: [
      {
        author: 'SiteMod_Nia',
        age: '18h ago',
        score: 51,
        developer: true,
        body: 'Yes. Display capture grabs the monitor, so viewers see what you see. Use game capture on the client window, record locally while still offline, and scrub the moment you open the menu before you go live. This does not cover a teammate recording their own pc.',
        replies: [
          {
            author: 'pathy_clips',
            age: '14h ago',
            score: 15,
            body: 'switched the source. local file is clean. working 100% before i hit go live next time.',
          },
        ],
      },
    ],
    sourceTitle: 'How Stream Proof Overlays Protect Content Creators',
    sourcePath: '/blog/stream-proof-creators/',
  },
  {
    slug: 'loot-text-on-the-first-bin',
    category: 'Guides & Builds',
    categoryTone: 'blue',
    title: 'Loot text covering the first bin',
    excerpt: 'Drop is a wall of labels. I just need the closest gun, not every attachment on the map.',
    description:
      'Loot labels covered the landing. Staff suggested three stops: closest gun, one sustain item, then leave. OP says the drop is readable now.',
    author: 'octane_otp',
    age: '7h ago',
    date: 'Oct 29, 2026',
    upvotes: 33,
    flair: 'Solved',
    closed: true,
    body: [
      'hot drop and the floor is just words. i cannot tell which bin is the gun in my room.',
      'i do not need every hop-up in the next building. how are you using loot labels in the first minute?',
    ],
    comments: [
      {
        author: 'SiteMod_Nia',
        age: '5h ago',
        score: 22,
        developer: true,
        body: 'Three stops. Closest weapon you can take without crossing open ground. Then shield or heals, whichever is nearer. Then the exit away from the other balloons. Anything still glowing after that stays on the floor. A label is not an order to run back.',
        replies: [
          {
            author: 'octane_otp',
            age: '3h ago',
            score: 10,
            body: 'did the 3 stop thing. actually left with a gun. working 100% 💀',
          },
        ],
      },
    ],
    sourceTitle: 'Streamline Your Drop Strategy with Advanced Loot ESP',
    sourcePath: '/blog/loot-esp-drop-strategy/',
  },
  {
    slug: 'does-lifetime-include-spoofer',
    category: 'General',
    categoryTone: 'purple',
    title: 'Does lifetime include the spoofer?',
    excerpt: 'Before I pay once: is the HWID tool inside the lifetime menu or a different checkout?',
    description:
      'Pre-buy question: the lifetime menu key does not include the HWID spoofer. Staff confirm it is a separate product and a separate checkout.',
    author: 'crypto_drone7',
    age: '4h ago',
    date: 'Nov 6, 2026',
    upvotes: 29,
    flair: 'Pre-buy',
    body: [
      'about to grab lifetime on the menu. $150. does that also unlock the spoofer or is that another buy?',
      'dont want to find out after checkout lol.',
    ],
    comments: [
      {
        author: 'SupportStaff',
        age: '2h ago',
        score: 24,
        developer: true,
        body: 'Lifetime and the 31 day key unlock the same menu modules. Lifetime does not include the spoofer. That is its own checkout. Buy the menu for visuals and aim. Buy the spoofer only if the problem is the pc, not the account.',
        replies: [
          {
            author: 'crypto_drone7',
            age: '1h ago',
            score: 7,
            body: 'bet. menu only for me then. clear.',
          },
        ],
      },
    ],
  },
];

export const forumPosts: ForumPost[] = rawPosts.map(withCounts);

export function getForumPost(slug: string) {
  return forumPosts.find((post) => post.slug === slug);
}
