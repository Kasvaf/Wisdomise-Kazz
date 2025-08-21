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
    alias: string;
  }
> = {
  'coin-radar': {
    alias: 'c',
  },
  'network-radar': {
    alias: 'n',
  },
  portfolio: {
    alias: 'p',
  },
  'social-radar': {
    alias: 's',
  },
  'technical-radar': {
    alias: 't',
  },
  'whale-radar': {
    alias: 'w',
  },
  positions: {
    alias: 'z',
  },
  'twitter-tracker': {
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
