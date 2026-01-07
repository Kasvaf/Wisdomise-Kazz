import type {
  Token,
  TokenHolder,
  TokenTransaction,
  TopTrader,
} from '../types/token';

// Helper to generate realistic transaction data
function generateMockTransactions(count: number): TokenTransaction[] {
  const transactions: TokenTransaction[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const isBuy = Math.random() > 0.5;
    transactions.push({
      id: `tx_${i}_${Math.random().toString(36).substr(2, 9)}`,
      type: isBuy ? 'buy' : 'sell',
      amount: Math.random() * 10_000,
      priceUsd: Math.random() * 1000,
      solAmount: Math.random() * 10,
      timestamp: now - i * 60_000 * (1 + Math.random() * 10), // Random time in last few hours
      walletAddress: `${Math.random().toString(36).substr(2, 4)}...${Math.random().toString(36).substr(2, 4)}`,
      txHash: Math.random().toString(36).substr(2, 16),
      isKnownWallet: Math.random() > 0.8,
      walletLabel:
        Math.random() > 0.8
          ? Math.random() > 0.5
            ? 'Whale'
            : 'Dev'
          : undefined,
    });
  }

  return transactions;
}

// Helper to generate holder data
function generateMockHolders(count: number): TokenHolder[] {
  const holders: TokenHolder[] = [];
  let remainingPercent = 100;

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1;
    const percent = isLast
      ? remainingPercent
      : Math.min(Math.random() * 20, remainingPercent);
    remainingPercent -= percent;

    holders.push({
      address: `${Math.random().toString(36).substr(2, 4)}...${Math.random().toString(36).substr(2, 4)}`,
      percentage: percent,
      amount: Math.random() * 1_000_000,
      isKnown: Math.random() > 0.7,
      label:
        Math.random() > 0.7
          ? ['Dev', 'Team', 'CEX', 'Whale'][Math.floor(Math.random() * 4)]
          : undefined,
      isContract: Math.random() > 0.9,
    });
  }

  return holders.sort((a, b) => b.percentage - a.percentage);
}

// Mock token data
export const MOCK_TOKENS: Token[] = [
  // 1. CUM - High market cap pump.fun token (from the URL example)
  {
    metadata: {
      name: 'CumRocket',
      ticker: 'CUM',
      platform: 'pump',
      contractAddress: 'CASHx9KJUStyftLFWGvEVf59SGeG9sh5FfcnZMVPCASH',
      age: '17h',
      description: 'The most memeable token on Solana',
      twitter: 'https://twitter.com/cumrocket',
      telegram: 'https://t.me/cumrocket',
    },
    statistics: {
      marketCap: 1_170_000,
      volume24h: 868_200,
      liquidity: 131_000,
      holders: 3950,
      currentPrice: 0.001_04,
      priceChanges: {
        '5m': -2.3,
        '1h': 5.7,
        '6h': -8.4,
        '24h': -14.4,
      },
      high24h: 0.001_17,
      low24h: 0.000_692,
      close: 0.000_887,
      fees24h: 124.3,
      viewers: 6,
    },
    security: {
      mintAuthority: false,
      freezeAuthority: false,
      lpBurned: true,
      topHolderPercent: 8.5,
      isVerified: true,
      rugCheckScore: 85,
    },
    holders: generateMockHolders(10),
    recentTransactions: generateMockTransactions(20),
    position: {
      bought: 2.5,
      sold: 1.2,
      holding: 150_000,
      averageEntry: 0.000_95,
      pnl: 0.3,
      pnlPercent: 12.5,
    },
  },

  // 2. BONK - Established token with high volume
  {
    metadata: {
      name: 'Bonk',
      ticker: 'BONK',
      platform: 'raydium',
      contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      age: '6mo',
      description: 'The dog coin of Solana',
      website: 'https://bonkcoin.com',
      twitter: 'https://twitter.com/bonkcoin',
    },
    statistics: {
      marketCap: 850_000_000,
      volume24h: 45_000_000,
      liquidity: 12_500_000,
      holders: 425_000,
      currentPrice: 0.000_012_5,
      priceChanges: {
        '5m': 1.2,
        '1h': 3.5,
        '6h': 8.9,
        '24h': 15.7,
      },
      high24h: 0.000_013_5,
      low24h: 0.000_010_8,
      close: 0.000_012_5,
      fees24h: 8500,
      viewers: 142,
    },
    security: {
      mintAuthority: false,
      freezeAuthority: false,
      lpBurned: true,
      topHolderPercent: 4.2,
      isVerified: true,
      rugCheckScore: 95,
    },
    holders: generateMockHolders(15),
    recentTransactions: generateMockTransactions(50),
  },

  // 3. PEPE - New pump.fun token with growth potential
  {
    metadata: {
      name: 'Pepe Solana',
      ticker: 'PEPE',
      platform: 'pump',
      contractAddress: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
      age: '4h',
      description: 'Pepe on Solana. The real deal.',
      twitter: 'https://twitter.com/pepesolana',
    },
    statistics: {
      marketCap: 285_000,
      volume24h: 125_000,
      liquidity: 45_000,
      holders: 890,
      currentPrice: 0.000_285,
      priceChanges: {
        '5m': 8.5,
        '1h': 25.3,
        '6h': 0,
        '24h': 0,
      },
      high24h: 0.000_32,
      low24h: 0.000_18,
      close: 0.000_285,
      fees24h: 35.2,
      viewers: 23,
    },
    security: {
      mintAuthority: false,
      freezeAuthority: false,
      lpBurned: false,
      topHolderPercent: 15.3,
      isVerified: false,
      rugCheckScore: 65,
    },
    holders: generateMockHolders(8),
    recentTransactions: generateMockTransactions(15),
  },

  // 4. DOGE - Mid-cap token with declining price
  {
    metadata: {
      name: 'Doge Solana',
      ticker: 'DOGE',
      platform: 'jupiter',
      contractAddress: '8bqjz7sswPbEjH5HdRPdQUDJzVNPNKGvJeETFmJZrYhE',
      age: '2d',
      description: 'Much wow, very Solana',
      website: 'https://dogesolana.io',
    },
    statistics: {
      marketCap: 520_000,
      volume24h: 185_000,
      liquidity: 78_000,
      holders: 1850,
      currentPrice: 0.000_52,
      priceChanges: {
        '5m': -1.8,
        '1h': -4.2,
        '6h': -12.5,
        '24h': -28.3,
      },
      high24h: 0.000_72,
      low24h: 0.000_48,
      close: 0.000_52,
      fees24h: 52.8,
      viewers: 14,
    },
    security: {
      mintAuthority: true,
      freezeAuthority: false,
      lpBurned: true,
      topHolderPercent: 12.8,
      isVerified: false,
      rugCheckScore: 55,
    },
    holders: generateMockHolders(12),
    recentTransactions: generateMockTransactions(25),
  },

  // 5. SAMO - Stable established token
  {
    metadata: {
      name: 'Samoyedcoin',
      ticker: 'SAMO',
      platform: 'orca',
      contractAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      age: '1y',
      description: 'Solanas Ambassador',
      website: 'https://samoyedcoin.com',
      twitter: 'https://twitter.com/samoyedcoin',
      telegram: 'https://t.me/samoyedcoin',
    },
    statistics: {
      marketCap: 45_000_000,
      volume24h: 2_500_000,
      liquidity: 1_200_000,
      holders: 85_000,
      currentPrice: 0.0098,
      priceChanges: {
        '5m': 0.5,
        '1h': 1.2,
        '6h': 2.8,
        '24h': 3.5,
      },
      high24h: 0.0102,
      low24h: 0.0095,
      close: 0.0098,
      fees24h: 1250,
      viewers: 68,
    },
    security: {
      mintAuthority: false,
      freezeAuthority: false,
      lpBurned: true,
      topHolderPercent: 3.5,
      isVerified: true,
      rugCheckScore: 98,
    },
    holders: generateMockHolders(20),
    recentTransactions: generateMockTransactions(40),
  },
];

// Helper functions
export function getMockTokenByAddress(address: string): Token | undefined {
  return MOCK_TOKENS.find(token => token.metadata.contractAddress === address);
}

export function getMockTokenByTicker(ticker: string): Token | undefined {
  return MOCK_TOKENS.find(token => token.metadata.ticker === ticker);
}

export function getMockTokensByPlatform(platform: string): Token[] {
  return MOCK_TOKENS.filter(token => token.metadata.platform === platform);
}

export function getAllMockTokens(): Token[] {
  return MOCK_TOKENS;
}

// Generate mock top traders
export function generateMockTopTraders(count = 10): TopTrader[] {
  const traders: TopTrader[] = [];

  for (let i = 0; i < count; i++) {
    const pnl = (Math.random() - 0.3) * 50; // Bias towards profit
    traders.push({
      address: `${Math.random().toString(36).substr(2, 4)}...${Math.random().toString(36).substr(2, 4)}`,
      pnl: pnl,
      pnlPercent: pnl * (10 + Math.random() * 20),
      totalBought: Math.random() * 100,
      totalSold: Math.random() * 80,
      trades: Math.floor(Math.random() * 50) + 5,
      isKnown: Math.random() > 0.7,
      label:
        Math.random() > 0.7
          ? ['Smart Money', 'Whale', 'Sniper'][Math.floor(Math.random() * 3)]
          : undefined,
    });
  }

  return traders.sort((a, b) => b.pnl - a.pnl);
}
