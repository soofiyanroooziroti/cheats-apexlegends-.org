const LOCALE_PREFIX = /^\/(ja|zh-cn|es|ru|pt-br|de|fr|ko)(?=\/|$)/;

function barePath(pathname: string): string {
  const stripped = pathname.replace(LOCALE_PREFIX, '') || '/';
  if (stripped === '/') return '/';
  return stripped.endsWith('/') ? stripped : `${stripped}/`;
}

/** One descriptive alt per audited URL so the logo is not an empty image. */
export function logoAltForPath(pathname: string): string {
  const path = barePath(pathname);

  if (path === '/') return 'Apex cheats – logo';
  if (path === '/products/apex-cheats/') return 'Apex Legends – logo';
  if (path === '/products/apex-cheats/loader/') return 'Squad overlays – logo';
  if (path === '/blog/') return 'Guides – logo';
  if (path === '/forum/') return 'Forum – logo';
  if (path === '/faq/') return 'Faq – logo';
  if (path === '/support/') return 'Support – logo';
  return 'Apex cheats logo';
}
