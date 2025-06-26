/* note: aliases must be a string with the length of 1 and be unique for each section */

export const LISTS: Record<
  | 'portfolio'
  | 'coin-radar'
  | 'network-radar'
  | 'social-radar'
  | 'technical-radar'
  | 'whale-radar'
  | 'positions'
  | 'twitter-tracker',
  {
    expandable: boolean;
    alias: string;
  }
> = {
  'coin-radar': {
    expandable: true,
    alias: 'c',
  },
  'network-radar': {
    expandable: true,
    alias: 'n',
  },
  'portfolio': {
    expandable: true,
    alias: 'p',
  },
  'social-radar': {
    expandable: true,
    alias: 's',
  },
  'technical-radar': {
    expandable: true,
    alias: 't',
  },
  'whale-radar': {
    expandable: true,
    alias: 'w',
  },
  'positions': {
    expandable: true,
    alias: 'z',
  },
  'twitter-tracker': {
    expandable: false,
    alias: 'x',
  },
} as const;

export const DETAILS: Record<
  'coin' | 'whale' | 'wallet',
  {
    alias: string;
  }
> = {
  coin: {
    alias: 'c',
  },
  whale: {
    alias: 'd',
  },
  wallet: {
    alias: 'w',
  },
};

export const VIEWS: Record<
  'list' | 'detail' | 'both',
  {
    alias: string;
  }
> = {
  list: {
    alias: 'l',
  },
  detail: {
    alias: 'd',
  },
  both: {
    alias: 'b',
  },
};
