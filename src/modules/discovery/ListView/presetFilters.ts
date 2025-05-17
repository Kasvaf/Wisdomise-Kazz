import {
  type useSocialRadarCoins,
  type useTechnicalRadarCoins,
  type useWhaleRadarCoins,
} from 'api/insight';
import { type useNetworkRadarNCoins } from 'api/insight/network';

export interface PresetFilter<FilterType> {
  label: string;
  filters: FilterType;
}

const memesPreset = {
  label: '🔥 Memes',
  filters: {
    categories: [
      'meme-token',
      'dog-themed-coins',
      'desci-meme',
      'elon-musk-inspired-coins',
      'solana-meme-coins',
      'sui-meme',
      'base-meme-coins',
      'tron-meme',
      'ton-meme-coins',
      'wojak-themed',
      'mascot-themed',
      'emoji-themed',
      'zodiac-themed',
      'frog-themed-coins',
      'country-themed-meme-coins',
      'parody-meme-coins',
      'wall-street-bets-themed-coins',
      'duck-themed-coins',
      'cat-themed-coins',
      'sticker-themed-coin',
      'presale-meme-coins',
      'ai-meme-coins',
    ],
  },
};

const aiPreset = {
  label: '🔥 AI',
  filters: {
    categories: [
      'artificial-intelligence',
      'ai-agent-launchpad',
      'ai-applications',
      'ai-framework',
      'ai-agents',
      'paal-ai',
      'defai',
      'ai-meme-coins',
    ],
  },
};

const defiPreset = {
  label: '🔥 DeFi',
  filters: {
    categories: [
      'decentralized-finance-defi',
      'decentralized-exchange',
      'defi-index',
      'defi-pulse-index-dpi', // ! 'DeFi Pulse Index (DPI)',
      'defiance-capital-portfolio',
      'depin',
      'liquid-staking',
      'yield-farming',
      'stablecoin-protocol',
      'decentralized-perpetuals', // 'Decentralized Perpetuals',
      // '!!! DeFi Launchpads',
      'decentralized-derivatives', // ! 'Decentralized Derivatives',
    ],
  },
};

const rwaPreset = {
  label: '🔥 RWA',
  filters: {
    categories: [
      'real-world-assets-rwa',
      'tokenized-real-estate',
      'tokenized-commodities',
      'tokenized-t-bills',
      'tokenized-treasury-bonds-t-bonds',
      'rwa-protocol',
    ],
  },
};

const gamingPreset = {
  label: '🔥 Gaming',
  filters: {
    categories: [
      'gaming',
      'play-to-earn',
      'gaming-platform',
      'on-chain-gaming',
      'strategy-games',
      'simulation-games',
      'sports-games',
      'farming-games',
      'card-games',
      'racing-games',
      'adventure-games',
      'axie-infinity',
      'gaming-utility-token',
      // @ 'NFT Gaming',
      'nft-lending-borrowing',
      'gaming-blockchains',
    ],
  },
};

const depinPreset = {
  label: '🔥 DePIN',
  filters: {
    categories: ['depin'],
  },
};

const binanceHodlerPreset = {
  label: '🔥 Binance HODLer Airdrops',
  filters: {
    categories: [
      'binance-hodler-airdrops',
      'binance-alpha-spotlight',
      'binance-launchpad',
      'binance-labs-portfolio',
      'binance-launchpool',
    ],
  },
};

const layer1Preset = {
  label: '🔥 Layer 1',
  filters: {
    categories: [
      'layer-1',
      'layer-0-l0',
      'avalanche-subnet',
      'dot-ecosystem',
      'ethereum-ecosystem',
      'solana-ecosystem',
      'cosmos-ecosystem',
    ],
  },
};

const layer2Preset = {
  label: '🔥 Layer 2',
  filters: {
    categories: [
      'layer-2',
      'layer-3-l3',
      'superchain-ecosystem',
      'polygon-zkevm-ecosystem',
      'arbitrum-ecosystem',
      'binance-smart-chain', // ! 'Binance Smart Chain (BSC) Ecosystem',
      'ethereum-pos-iou',
      'avalanche-subnet', // ! 'Avalanche Subnet',
      'cardano-ecosystem',
      'dot-ecosystem',
      'fantom-ecosystem',
      'tezos-ecosystem',
      'algorand-ecosystem',
      'bittensor-ecosystem',
      'zilliqa-ecosystem',
      'cardano-ecosystem',
    ],
  },
};

const dotPreset = {
  label: '🔥 DOT',
  filters: {
    categories: ['dot-ecosystem', 'layer-0-l0'],
  },
};

export const SOCIAL_RADAR_PRESETS: Array<
  PresetFilter<Partial<Parameters<typeof useSocialRadarCoins>[0]>>
> = [
  memesPreset,
  aiPreset,
  defiPreset,
  rwaPreset,
  gamingPreset,
  depinPreset,
  binanceHodlerPreset,
  layer1Preset,
  layer2Preset,
  dotPreset,
];

export const SOCIAL_RADAR_SORTS: Array<
  PresetFilter<Partial<Parameters<typeof useSocialRadarCoins>[0]>>
> = [
  {
    label: 'Wise Rank™',
    filters: {
      sortBy: 'rank',
      sortOrder: 'ascending',
    },
  },
  {
    label: 'Newest',
    filters: {
      sortBy: 'call_time',
      sortOrder: 'descending',
    },
  },
  {
    label: 'Oldest',
    filters: {
      sortBy: 'call_time',
      sortOrder: 'ascending',
    },
  },
  {
    label: 'Highest Gainers',
    filters: {
      sortBy: 'price_change',
      sortOrder: 'descending',
    },
  },
  {
    label: 'Highest Losers',
    filters: {
      sortBy: 'price_change',
      sortOrder: 'ascending',
    },
  },
  {
    label: 'Market Cap',
    filters: {
      sortBy: 'market_cap',
      sortOrder: 'ascending',
    },
  },
];

export const TECHNICAL_RADAR_PRESETS: Array<
  PresetFilter<Partial<Parameters<typeof useTechnicalRadarCoins>[0]>>
> = [
  memesPreset,
  aiPreset,
  defiPreset,
  rwaPreset,
  gamingPreset,
  depinPreset,
  binanceHodlerPreset,
  layer1Preset,
  layer2Preset,
  dotPreset,
];

export const TECHNICAL_RADAR_SORTS: Array<
  PresetFilter<Partial<Parameters<typeof useTechnicalRadarCoins>[0]>>
> = [
  {
    label: 'Wise Rank™',
    filters: {
      sortBy: 'rank',
      sortOrder: 'ascending',
    },
  },
  {
    label: 'Highest Gainers',
    filters: {
      sortBy: 'price_change',
      sortOrder: 'descending',
    },
  },
  {
    label: 'Highest Losers',
    filters: {
      sortBy: 'price_change',
      sortOrder: 'ascending',
    },
  },
  {
    label: 'Market Cap',
    filters: {
      sortBy: 'market_cap',
      sortOrder: 'descending',
    },
  },
];

export const WHALE_RADAR_PRESETS: Array<
  PresetFilter<Partial<Parameters<typeof useWhaleRadarCoins>[0]>>
> = [
  {
    label: '🔥 Profitable Coins',
    filters: {
      profitableOnly: true,
    },
  },
  memesPreset,
  aiPreset,
  rwaPreset,
  gamingPreset,
];

export const WHALE_RADAR_SORTS: Array<
  PresetFilter<Partial<Parameters<typeof useWhaleRadarCoins>[0]>>
> = [
  {
    label: 'Index',
    filters: {
      sortBy: 'rank',
      sortOrder: 'ascending',
    },
  },
  {
    label: 'Most Bought',
    filters: {
      sortBy: 'buy',
      sortOrder: 'descending',
    },
  },
  {
    label: 'Most Sold',
    filters: {
      sortBy: 'sell',
      sortOrder: 'descending',
    },
  },
  {
    label: 'Highest Transfer Vol',
    filters: {
      sortBy: 'transfer',
      sortOrder: 'descending',
    },
  },
  {
    label: 'Highest Wallet No',
    filters: {
      sortBy: 'wallet_count',
      sortOrder: 'descending',
    },
  },
  {
    label: 'Highest Gainers',
    filters: {
      sortBy: 'price_change',
      sortOrder: 'descending',
    },
  },
  {
    label: 'Highest Losers',
    filters: {
      sortBy: 'price_change',
      sortOrder: 'ascending',
    },
  },
  {
    label: 'Market Cap',
    filters: {
      sortBy: 'market_cap',
      sortOrder: 'descending',
    },
  },
];

export const NETWORK_RADAR_PRESETS: Array<
  PresetFilter<Partial<Parameters<typeof useNetworkRadarNCoins>[0]>>
> = [
  {
    label: '🔥 Under 1H',
    filters: {
      maxAgeMinutes: 59,
    },
  },
  {
    label: '🔥 Safe Haven',
    filters: {
      safeTopHolder: true, // NAITODO Ask
    },
  },
  {
    label: '🔥 Trending',
    filters: {
      burnt: true,
    }, // NAITODO Ask
  },
  {
    label: '🔥 Buzzing',
    filters: {
      maxAgeMinutes: 1,
    }, // NAITODO Ask
  },
  {
    label: '🔥 Liquid Gold',
    filters: {
      minAgeMinutes: 1,
    }, // NAITODO Ask
  },
  {
    label: '🔥 Active Market',
    filters: {
      hasTelegram: true,
    }, // NAITODO Ask
  },
  {
    label: '🔥 Fully Verified',
    filters: {
      noMint: true,
    }, // NAITODO Ask
  },
  {
    label: '🔥 Buzzing',
    filters: {
      hasWebsite: true,
    }, // NAITODO Ask
  },
  {
    label: '🔥 Dev Hold',
    filters: {
      query: 'sol',
    }, // NAITODO Ask
  },
  {
    label: '🔥 Dev Sold All',
    filters: {
      query: 'dev',
    }, // NAITODO Ask
  },
];
