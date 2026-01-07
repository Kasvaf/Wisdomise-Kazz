// Token metadata and basic information
export interface TokenMetadata {
  name: string;
  ticker: string;
  platform: 'pump' | 'raydium' | 'jupiter' | 'orca' | 'meteora';
  contractAddress: string;
  imageUrl?: string;
  age: string; // e.g., "17h", "2d", "1mo"
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
}

// Token statistics and metrics
export interface TokenStatistics {
  marketCap: number;
  volume24h: number;
  liquidity: number;
  holders: number;
  currentPrice: number;
  priceChanges: {
    '5m': number;
    '1h': number;
    '6h': number;
    '24h': number;
  };
  high24h: number;
  low24h: number;
  close: number;
  fees24h?: number;
  viewers?: number; // Active viewers count
}

// Token security information
export interface TokenSecurity {
  mintAuthority: boolean;
  freezeAuthority: boolean;
  lpBurned: boolean;
  topHolderPercent: number;
  isVerified?: boolean;
  rugCheckScore?: number; // 0-100
}

// Token holder information
export interface TokenHolder {
  address: string;
  percentage: number;
  amount: number;
  isKnown: boolean;
  label?: string; // e.g., "Team", "Dev", "CEX"
  isContract?: boolean;
}

// Token transaction information
export interface TokenTransaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  priceUsd: number;
  solAmount?: number;
  timestamp: number; // Unix timestamp
  walletAddress: string;
  txHash: string;
  isKnownWallet?: boolean;
  walletLabel?: string;
}

// Position information for user's holdings
export interface TokenPosition {
  bought: number; // Total amount bought in SOL
  sold: number; // Total amount sold in SOL
  holding: number; // Current holding in tokens
  averageEntry: number; // Average entry price
  pnl: number; // Profit/Loss in SOL
  pnlPercent: number; // Profit/Loss percentage
}

// Complete token interface combining all information
export interface Token {
  metadata: TokenMetadata;
  statistics: TokenStatistics;
  security: TokenSecurity;
  holders: TokenHolder[];
  recentTransactions: TokenTransaction[];
  position?: TokenPosition; // User's position (optional, only if user owns)
}

// Chart data types
export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface ChartData {
  timeframe: '5m' | '15m' | '1h' | '4h' | '1d';
  data: ChartDataPoint[];
}

// Top traders information
export interface TopTrader {
  address: string;
  pnl: number;
  pnlPercent: number;
  totalBought: number;
  totalSold: number;
  trades: number;
  isKnown: boolean;
  label?: string;
}
