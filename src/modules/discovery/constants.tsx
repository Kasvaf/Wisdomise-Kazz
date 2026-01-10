export const VIEWS = ['list', 'detail'] as const;

export const LISTS = [
  'portfolio',
  'bluechips',
  'trench',
  'social-radar',
  'technical-radar',
  'whale-radar',
  'positions',
  'wallet-tracker',
  'twitter-tracker',
  'meta',
] as const;

export const DETAILS = ['token', 'whale', 'wallet'] as const;

export const LIST_NAMES: Record<(typeof LISTS)[number], string> = {
  portfolio: 'Portfolio',
  bluechips: 'Bluechips',
  trench: 'Trench',
  'social-radar': 'Social Radar',
  'technical-radar': 'Technical Radar',
  'whale-radar': 'Whale Radar',
  positions: 'Positions',
  'wallet-tracker': 'Wallet Tracker',
  'twitter-tracker': 'X Tracker',
  meta: 'Meta Tracker',
};
