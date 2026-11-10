/** Checkout destinations (Zadeyo affiliate). */
export const CHECKOUT_URLS = {
  apex: 'https://zadeyo.com/go/SOOFIYAN?to=%2Fproducts%2Fapex-legends',
  hwidSpoofer: 'https://zadeyo.com/go/SOOFIYAN?to=%2Fproducts%2Fhwid-spoofer',
};

export const DISCORD_INVITE_URL = 'https://discord.com/invite/2gMnnaPWq';

export const CHECKOUT_PATH_REDIRECTS = new Map([
  ['/go/discord', DISCORD_INVITE_URL],
  ['/go/discord/', DISCORD_INVITE_URL],
  ['/go/apex', CHECKOUT_URLS.apex],
  ['/go/apex/', CHECKOUT_URLS.apex],
  ['/go/apex-legends', CHECKOUT_URLS.apex],
  ['/go/apex-legends/', CHECKOUT_URLS.apex],
  ['/go/hwid-spoofer', CHECKOUT_URLS.hwidSpoofer],
  ['/go/hwid-spoofer/', CHECKOUT_URLS.hwidSpoofer],
]);

export function resolveCheckoutPathRedirect(pathname) {
  const direct = CHECKOUT_PATH_REDIRECTS.get(pathname);
  if (direct) return direct;

  if (pathname !== '/' && !pathname.endsWith('/')) {
    return CHECKOUT_PATH_REDIRECTS.get(`${pathname}/`) ?? null;
  }

  return null;
}

export function checkoutEdgeRedirectLines() {
  const lines = [];
  for (const [p, url] of CHECKOUT_PATH_REDIRECTS) {
    lines.push(`${p} ${url} 302`);
  }
  return lines;
}
