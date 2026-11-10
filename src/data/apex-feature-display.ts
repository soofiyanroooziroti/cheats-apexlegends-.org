import type { IconName } from '../components/icons/types';
import { APEX_MENU_FEATURES } from './apex-menu-features';

const iconByModule: Record<string, IconName> = {
  'Player ESP': 'espActive',
  'Advanced Aimbot': 'softAim',
  'Weapon ESP': 'featureEsp',
  'Health Bar': 'featureEsp',
  'Distance ESP': 'featureEsp',
  'Box ESP': 'featureEsp',
  'Skeleton ESP': 'skeletonEsp',
  'Loot ESP': 'lootEsp',
  'No Recoil': 'noRecoil',
  'EA Javelin Bypass': 'shieldCheck',
  'Stream Proof': 'streamProof',
  '24/7 Support': 'support247',
};

/** Homepage hero marquee — exactly the twelve published menu modules. */
export const apexHeroModulePills = APEX_MENU_FEATURES.map((feature) => ({
  icon: iconByModule[feature.name] ?? 'crosshair',
  label: feature.name,
}));

export const apexModuleNames = APEX_MENU_FEATURES.map((f) => f.name);
