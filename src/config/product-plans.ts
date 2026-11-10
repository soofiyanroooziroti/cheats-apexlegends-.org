/** Short-access length on every product (no 90-day tier). */
export const SHORT_PLAN_DAYS = 31;

export const LIFETIME_USD = 150;

export const MENU_SHORT_USD = 35;
/** HWID spoofer 31-day plan — $50 monthly, not the $35 menu price. */
export const SPOOFER_SHORT_USD = 50;

export const MENU_PLANS_LINE = `$${MENU_SHORT_USD} for ${SHORT_PLAN_DAYS} days or $${LIFETIME_USD} lifetime`;
export const SPOOFER_PLANS_LINE = `$${SPOOFER_SHORT_USD} for ${SHORT_PLAN_DAYS} days or $${LIFETIME_USD} lifetime`;

export const MENU_PLANS_SHORT = `$${MENU_SHORT_USD} and $${LIFETIME_USD}`;
export const SPOOFER_PLANS_SHORT = `$${SPOOFER_SHORT_USD} and $${LIFETIME_USD}`;

/** FAQ / status / about — menu and HWID spoofer. */
export const ALL_PRODUCTS_PLANS_LINE = `The menu is ${MENU_PLANS_LINE}. The HWID spoofer is ${SPOOFER_PLANS_LINE}.`;
