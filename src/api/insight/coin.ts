import { useQuery } from '@tanstack/react-query';
import { resolvePageResponseToArray } from 'api/utils';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import {
  type CoinNetwork,
  type Coin,
  type NetworkSecurity,
  type MiniMarketData,
} from '../types/shared';
import {
  MINIMUM_SOCIAL_RADAR_HIGHLIGHTED_SCORE,
  type SocialRadarSentiment,
} from './social';
import {
  type TechnicalRadarSentiment,
  type MacdConfirmation,
  type RsiConfirmation,
  MINIMUM_TECHNICAL_RADAR_HIGHLIGHTED_SCORE,
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
  _highlighted?: boolean;
}

export const useCoinRadarCoins = (config: { networks?: string[] }) => {
  const [globalNetwork] = useGlobalNetwork();
  return useQuery({
    queryKey: ['coin-radar-coins'],
    queryFn: () =>
      resolvePageResponseToArray<CoinRadarCoin>(
        '/delphi/intelligence/overview/',
        {
          query: {
            page_size: 1200,
          },
        },
      ),
    select: data =>
      data
        .map(row => ({
          ...row,
          _highlighted:
            (row.social_radar_insight?.wise_score ?? 0) >
              MINIMUM_SOCIAL_RADAR_HIGHLIGHTED_SCORE ||
            (row.technical_radar_insight?.wise_score ?? 0) >
              MINIMUM_TECHNICAL_RADAR_HIGHLIGHTED_SCORE,
        }))
        .filter(row => {
          if (
            !matcher([
              ...(globalNetwork ? [globalNetwork] : []),
              ...(config.networks ?? []),
            ]).array(row.networks?.map(x => x.network.slug))
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
    meta: {
      persist: true,
    },
    refetchInterval: 1000 * 30,
    refetchOnMount: true,
  });
};
