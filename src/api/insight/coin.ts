import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import {
  type CoinNetwork,
  type Coin,
  type NetworkSecurity,
  type MiniMarketData,
} from '../types/shared';
import { type SocialRadarSentiment } from './social';
import {
  type TechnicalRadarSentiment,
  type MacdConfirmation,
  type RsiConfirmation,
} from './technical';
import { matcher } from './utils';

export interface CoinRadarCoin {
  rank: number;
  social_radar_insight?: null | SocialRadarSentiment;
  technical_radar_insight?:
    | null
    | (RsiConfirmation & MacdConfirmation & TechnicalRadarSentiment);
  symbol: Coin;
  symbol_labels?: null | string[];
  symbol_security?: null | {
    data: NetworkSecurity[];
  };
  total_score?: null | number;
  networks?: null | CoinNetwork[];
  market_data?: MiniMarketData;
}

export const useCoinRadarCoins = (config: { networks?: string[] }) =>
  useQuery({
    queryKey: ['coin-radar-coins'],
    queryFn: () => ofetch<CoinRadarCoin[]>('/delphi/intelligence/overview/'),
    select: data =>
      data.filter(row => {
        if (
          !matcher(config.networks).array(
            row.networks?.map(x => x.network.slug),
          )
        )
          return false;

        /* remove zero pools tokens if config.network contains solana */
        if (config.networks?.includes('solana')) {
          const solana = row.networks?.find(x => x.network.slug === 'solana');
          if (
            solana &&
            solana.symbol_network_type === 'TOKEN' &&
            !solana.pool_count
          )
            return false;
        }

        return true;
      }),
  });
