/** Static path redirects (301). Keys are pathname without query/hash. */
const HUB = '/products/apex-cheats/';
const LOADER = '/products/apex-cheats/loader/';
const SPOOFER = '/products/apex-cheats/hwid-spoofer/';
const UTILITIES = '/products/apex-cheats/utilities/';
const FEATURES = '/products/apex-cheats/loader/#features';

export const PATH_REDIRECTS = new Map([
  ['/blog', '/blog/'],
  ['/about', '/about/'],
  ['/contact', '/support/'],
  ['/contact/', '/support/'],
  ['/support', '/support/'],
  ['/privacy', '/privacy/'],
  ['/terms', '/terms/'],
  ['/faq', '/faq/'],
  ['/cheats', HUB],
  ['/cheats/', HUB],
  ['/blogs', '/blog/'],
  ['/blogs/', '/blog/'],
  ['/reviews', '/forum/'],
  ['/reviews/', '/forum/'],
  ['/refunds', '/terms/'],
  ['/refunds/', '/terms/'],
  ['/features', FEATURES],
  ['/features/', FEATURES],
  ['/products/apex-cheats', HUB],
  ['/products/apex-cheats/loader', LOADER],
  ['/products/apex-cheats/loader/', LOADER],
  ['/products/apex-cheats/hwid-spoofer', SPOOFER],
  ['/products/apex-cheats/hwid-spoofer/', SPOOFER],
  ['/products/apex-cheats/utilities', UTILITIES],
  ['/products/apex-cheats/utilities/', UTILITIES],
]);

/** Paths that should not receive a forced trailing slash. */
export const TRAILING_SLASH_SKIP = /\.[a-z0-9]+$/i;

export function resolvePathRedirect(pathname) {
  const direct = PATH_REDIRECTS.get(pathname);
  if (direct) return direct;

  if (pathname !== '/' && !pathname.endsWith('/') && !TRAILING_SLASH_SKIP.test(pathname)) {
    return `${pathname}/`;
  }

  return null;
}
