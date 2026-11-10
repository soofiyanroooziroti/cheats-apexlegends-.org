import {
  LIFETIME_USD,
  MENU_SHORT_USD,
  SHORT_PLAN_DAYS,
  SPOOFER_SHORT_USD,
} from '../config/product-plans';

export type ProductPlanId = 'mon' | 'threeMonth' | 'lifetime';

export interface ProductPlan {
  id: ProductPlanId;
  label: string;
  priceUsd: number;
  priceNote: string;
}

const shortLabel = `${SHORT_PLAN_DAYS} days`;
const shortNote = `USD · ${SHORT_PLAN_DAYS}-day access (P31D)`;
const lifetimeNote = 'USD · lifetime access (P99Y)';

function twoPlans(shortUsd: number): ProductPlan[] {
  return [
    { id: 'mon', label: shortLabel, priceUsd: shortUsd, priceNote: shortNote },
    { id: 'lifetime', label: 'Lifetime', priceUsd: LIFETIME_USD, priceNote: lifetimeNote },
  ];
}

/** Menu: $35 / $150 */
const loaderPlans = twoPlans(MENU_SHORT_USD);

/** HWID spoofer: $50 / $150 */
const spooferPlans = twoPlans(SPOOFER_SHORT_USD);

export function getProductPlans(productSlug: string): ProductPlan[] {
  if (productSlug === 'hwid-spoofer') {
    return spooferPlans.map((plan) => ({ ...plan }));
  }
  return loaderPlans.map((plan) => ({ ...plan }));
}

export function getDefaultPlan(productSlug: string): ProductPlan {
  const plans = getProductPlans(productSlug);
  return plans.find((p) => p.id === 'mon') ?? plans[0]!;
}

export function formatPlanPrice(usd: number): string {
  return `$${usd}`;
}

/** Plan is chosen on partner checkout — internal /go/ path only. */
export function checkoutUrlWithPlan(baseUrl: string, _planId: ProductPlanId): string {
  return baseUrl;
}

export function getProductFromPrice(productSlug: string): number {
  return getDefaultPlan(productSlug).priceUsd;
}
