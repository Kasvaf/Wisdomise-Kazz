export const AVAILABLE_LISTS = [
  'portfolio',
  'coin-radar',
  'network-radar',
  'social-radar',
  'technical-radar',
  'whale-radar',
] as const;

export const LISTS_CONFIG: Record<
  (typeof AVAILABLE_LISTS)[number],
  {
    expandable: boolean;
  }
> = {
  'coin-radar': {
    expandable: true,
  },
  'network-radar': {
    expandable: true,
  },
  'portfolio': {
    expandable: false,
  },
  'social-radar': {
    expandable: true,
  },
  'technical-radar': {
    expandable: true,
  },
  'whale-radar': {
    expandable: true,
  },
};

export const AVAILABLE_DETAILS = ['coin', 'whale'] as const;

export const AVAILABLE_VIEWS = ['detail', 'list', 'both'] as const;
