export type Risk = 'low' | 'medium' | 'high';

export interface Coin {
  weight: number;
  color: string;
  asset: string;
  fullAsset: string;
}

export interface Candle {
  close: number;
  pair_name: string;
  related_at: string;
}

export interface SPOContext {
  risk: Risk;
  coins: Coin[];
  isRefetching?: boolean;
  setRisk: (risk: Risk) => void;
  performancePercentageMaxDD: number;
}
