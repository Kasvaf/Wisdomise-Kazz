import { useQuery } from '@tanstack/react-query';

import { type Network, type Coin, type CoinDetails } from 'api/types/shared';
import { resolvePageResponseToArray } from 'api/utils';
import { matcher } from './utils';

export interface NetworkRadarPool {
  address: string;
  base_symbol: Coin;
  quote_symbol: Coin;
  network: Network;
  creation_datetime: string;
  initial_liquidity: {
    native: number;
    usd: number;
  };
  base_symbol_security: {
    lp_is_burned: {
      status: string;
    };
    holders: Array<{
      account: string;
      balance: string;
    }>;
    mintable: {
      status: string;
    };
    freezable: {
      status: string;
    };
  };
  base_community_data: CoinDetails['community_data'];
  update: {
    total_num_buys: number;
    total_num_sells: number;
    total_trading_volume: {
      native: number;
      usd: number;
    };
    liquidity: {
      native: number;
      usd: number;
    };
    liquidity_change?: {
      native: number;
      percent: number;
      usd: number;
    };
    base_market_data: {
      current_price: number;
      total_supply: number;
      market_cap: number;
    };
  };
}

export const useNetworkRadarPools = (config: { networks?: string[] }) =>
  useQuery({
    queryKey: ['coin-radar-coins'],
    queryFn: () =>
      resolvePageResponseToArray<NetworkRadarPool>(
        '/delphi/market/new-born-pools/',
        {
          query: {
            page_size: 20,
          },
        },
        {
          limit: 20,
        },
      ),
    select: data =>
      data.filter(row => {
        if (!matcher(config.networks).array([row.network.slug])) return false;
        return true;
      }),
    refetchInterval: 30 * 1000,
  });
