import { type useSocialRadarCoins } from 'api/insight';

export const presetFilters: Array<{
  label: string;
  slug: string;
  filters: Partial<Parameters<typeof useSocialRadarCoins>[0]>;
}> = [
  {
    label: '🔥 Memes',
    slug: 'meme',
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
  },
  {
    label: '🔥 AI',
    slug: 'ai',
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
  },
  {
    label: '🔥 SOL',
    slug: 'sol',
    filters: {
      networks: ['solana'],
    },
  },
  {
    label: '🔥 BASE',
    slug: 'base',
    filters: {
      networks: ['base'],
    },
  },
  {
    label: '🔥 DeFi',
    slug: 'defi',
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
  },
  {
    label: '🔥 RWA',
    slug: 'rwa',
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
  },
  {
    label: '🔥 Gaming',
    slug: 'gaming',
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
  },
  {
    label: '🔥 DePIN',
    slug: 'depin',
    filters: {
      categories: ['depin'],
    },
  },
  {
    label: '🔥 Binance HODLer Airdrops',
    slug: 'binance',
    filters: {
      categories: [
        'binance-hodler-airdrops',
        'binance-alpha-spotlight',
        'binance-launchpad',
        'binance-labs-portfolio',
        'binance-launchpool',
      ],
    },
  },
  {
    label: '🔥 Layer 1',
    slug: 'layer-1',
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
  },
  {
    label: '🔥 Layer 2',
    slug: 'layer-2',
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
  },
  {
    label: '🔥 DOT',
    slug: 'dot',
    filters: {
      categories: ['dot-ecosystem', 'layer-0-l0'],
    },
  },
];
