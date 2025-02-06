import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import { type CoinNetwork, type Coin, type NetworkSecurity } from './types';
import { type SocialRadarSentiment } from './social';
import { type MacdConfirmation, type RsiConfirmation } from './technical';

export interface CoinRadarCoin {
  rank: number;
  social_radar_insight?: null | SocialRadarSentiment;
  technical_radar_insight?:
    | null
    | (RsiConfirmation &
        MacdConfirmation & {
          technical_sentiment?: null | string;
          rsi_score?: null | number;
          macd_score?: null | number;
          wise_score?: null | number;
        });
  symbol: Coin;
  symbol_labels?: null | string[];
  symbol_security?: null | {
    data: NetworkSecurity[];
  };
  total_score?: null | number;
  networks?: null | CoinNetwork[];
}

export const useCoinRadarCoins = () =>
  useQuery({
    queryKey: ['coin-radar-coins'],
    queryFn: () => ofetch<CoinRadarCoin[]>('/delphi/intelligence/overview/'),
  });
