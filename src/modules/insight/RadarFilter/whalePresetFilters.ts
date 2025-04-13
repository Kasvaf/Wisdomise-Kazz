import { type useWhaleRadarCoins } from 'api/insight';

export const whalePresetFilters: Array<{
  label: string;
  slug: string;
  filters: Partial<Parameters<typeof useWhaleRadarCoins>[0]>;
}> = [
  {
    label: '🔥 Profitable Coins',
    slug: 'profitable',
    filters: {
      profitableOnly: true,
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
];
