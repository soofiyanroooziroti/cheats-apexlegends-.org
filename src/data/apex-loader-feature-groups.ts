import type { ProductFeatureGroup } from './product-types';
import { APEX_MENU_FEATURES } from './apex-menu-features';

function item(name: string, desc: string) {
  return { name, desc };
}

/** Loader feature list — flat module list for product pages. */
export const apexLoaderFeatureGroups: ProductFeatureGroup[] = [
  {
    name: 'Menu modules',
    items: APEX_MENU_FEATURES.map((f) => item(f.name, f.desc)),
  },
];
