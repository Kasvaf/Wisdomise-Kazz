import { useQuery } from '@tanstack/react-query';

import {
  type Network,
  type Coin,
  type CoinCommunityData,
} from 'api/types/shared';
import { resolvePageResponseToArray } from 'api/utils';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { matcher } from './utils';

export const calculateNCoinStates = (value: NetworkRadarNCoin) => {
  // Mintable: Indicates if more tokens can be created in the future (can lead to inflation).
  const mintable = value?.base_symbol_security.mintable.status !== '0';
  // Freezable: Indicates if token transfers can be paused or blocked by the contract owner.
  const freezable = value?.base_symbol_security.freezable.status !== '0';
  // Lp Is Burned: Shows whether liquidity tokens have been destroyed (liquidity locked = safer).
  const burnt = value?.base_symbol_security.lp_is_burned.status === '1';
  // Rugged: Indicates if the project has likely been a rug pull (scam with sudden fund removal).
  const rugged = value.rugged === true;
  // Safe to Holders: Indicates whether the largest token holders has less than 20% of total supply.
  const topHoldersBalance =
    value?.base_symbol_security.holders.reduce((p, c) => {
      const balance = Number.isNaN(+c.balance) ? 0 : +c.balance;
      return p + balance;
    }, 0) ?? 0;
  const totalSupply = value?.update.base_market_data.total_supply ?? 0;
  const safeTopHolders = topHoldersBalance <= (totalSupply / 100) * 20;

  const hasLargeTxns =
    (value.update.total_num_buys ?? 0) + (value.update.total_num_sells ?? 0) >
    5000;

  const riskLevel =
    (value.risk_percent ?? 0) < 15
      ? 'low'
      : (value.risk_percent ?? 0) < 50
      ? 'medium'
      : 'high';

  const isNew =
    new Date(value.creation_datetime).getTime() + 1000 * 60 * 60 > Date.now();

  return {
    mintable,
    freezable,
    burnt,
    rugged,
    safeTopHolders,
    hasLargeTxns,
    riskLevel,
    isNew,
  };
};
export interface NetworkRadarNCoin {
  _rank?: number;
  _states: ReturnType<typeof calculateNCoinStates>;
  address: string;
  base_contract_address: string;
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
  base_community_data: CoinCommunityData;
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
  risks?: Array<{
    name?: string;
    description?: string;
    level?: 'warn' | 'danger';
    score?: number;
    value?: string;
  }>;
  risk_percent?: number;
  rugged?: boolean;
}

export const useNetworkRadarNCoins = (config: {
  /* general */
  query?: string;
  excludeQuery?: string;
  // protocols?: Array<'moonshot' | 'raydium' | 'pump_amm'>,
  // bCurveMinPercent?: number,
  // bCurveMaxPercent?: number,
  networks?: string[];
  /* audit */
  burnt?: boolean;
  // devHasNotSoldYet?: boolean;
  // devSoldAll?: boolean;
  noMint?: boolean;
  safeTopHolder?: boolean;
  minRiskPercent?: number;
  maxRiskPercent?: number;
  /* metrics */
  minAgeMinutes?: number;
  maxAgeMinutes?: number;
  minLiquidity?: number;
  maxLiquidity?: number;
  minVolume?: number;
  maxVolume?: number;
  minMarketCap?: number;
  maxMarketCap?: number;
  minTransactions?: number;
  maxTransactions?: number;
  minNumBuys?: number;
  maxNumBuys?: number;
  minNumSells?: number;
  maxNumSells?: number;
  minLiquidityChangePercent?: number;
  maxLiquidityChangePercent?: number;
  /* socials */
  hasTwitter?: boolean;
  hasWebsite?: boolean;
  hasTelegram?: boolean;
  hasAtleastOneSocial?: boolean;
}) => {
  const [defaultNetwork] = useGlobalNetwork();
  return useQuery({
    queryKey: ['network-radar-pools'],
    queryFn: () =>
      resolvePageResponseToArray<NetworkRadarNCoin>(
        '/delphi/market/new-born-pools/',
        {
          query: {
            page_size: 999,
          },
        },
      ),
    select: data =>
      data
        .map(row => ({
          ...row,
          _states: calculateNCoinStates(row),
        }))
        .filter(row => {
          /* general */
          if (
            !matcher(config.query).coin(row.base_symbol) ||
            (config.excludeQuery &&
              matcher(config.excludeQuery).coin(row.base_symbol)) ||
            !matcher([defaultNetwork, ...(config.networks ?? [])]).array([
              row.network.slug,
            ])
          )
            return false;

          /* audit */
          const riskPercent = row.risk_percent ?? 0;
          if (
            (config.burnt && !row._states.burnt) ||
            (config.noMint && row._states.mintable) ||
            (config.safeTopHolder && !row._states.safeTopHolders) ||
            (typeof config.minRiskPercent === 'number' &&
              riskPercent < config.minRiskPercent) ||
            (typeof config.maxRiskPercent === 'number' &&
              riskPercent > config.maxRiskPercent)
          )
            return false;

          /* metrics */
          const ageMinutes =
            (Date.now() - new Date(row.creation_datetime).getTime()) / 60_000;
          const liquidity = row.update.liquidity.usd;
          const volume = row.update.total_trading_volume.usd;
          const marketCap = row.update.base_market_data.market_cap;
          const numBuys = row.update.total_num_buys;
          const numSells = row.update.total_num_sells;
          const numTransactions = numBuys + numSells;
          const liquidityChangePercent =
            row.update.liquidity_change?.percent ?? 0;
          if (
            (typeof config.minAgeMinutes === 'number' &&
              ageMinutes < config.minAgeMinutes) ||
            (typeof config.maxAgeMinutes === 'number' &&
              ageMinutes > config.maxAgeMinutes) ||
            (typeof config.minLiquidity === 'number' &&
              liquidity < config.minLiquidity) ||
            (typeof config.maxLiquidity === 'number' &&
              liquidity > config.maxLiquidity) ||
            (typeof config.minVolume === 'number' &&
              volume < config.minVolume) ||
            (typeof config.maxVolume === 'number' &&
              volume > config.maxVolume) ||
            (typeof config.minMarketCap === 'number' &&
              marketCap < config.minMarketCap) ||
            (typeof config.maxMarketCap === 'number' &&
              marketCap > config.maxMarketCap) ||
            (typeof config.minTransactions === 'number' &&
              numTransactions < config.minTransactions) ||
            (typeof config.maxTransactions === 'number' &&
              numTransactions > config.maxTransactions) ||
            (typeof config.minNumBuys === 'number' &&
              numBuys < config.minNumBuys) ||
            (typeof config.maxNumBuys === 'number' &&
              numBuys > config.maxNumBuys) ||
            (typeof config.minNumSells === 'number' &&
              numSells < config.minNumSells) ||
            (typeof config.maxNumSells === 'number' &&
              numSells > config.maxNumSells) ||
            (typeof config.minLiquidityChangePercent === 'number' &&
              liquidityChangePercent < config.minLiquidityChangePercent) ||
            (typeof config.maxLiquidityChangePercent === 'number' &&
              liquidityChangePercent > config.maxLiquidityChangePercent)
          )
            return false;

          /* socials */
          const hasTwitter =
            !!row.base_community_data.links?.twitter_screen_name;
          const hasWebsite = !!row.base_community_data.links?.homepage;
          const hasTelegram =
            !!row.base_community_data.links?.telegram_channel_identifier;
          const hasFacebook =
            !!row.base_community_data.links?.facebook_username;
          const hasReddit = !!row.base_community_data.links?.subreddit_url;
          if (
            (config.hasTwitter && !hasTwitter) ||
            (config.hasTelegram && !hasTelegram) ||
            (config.hasWebsite && !hasWebsite) ||
            (config.hasAtleastOneSocial &&
              ![
                hasTwitter,
                hasWebsite,
                hasTelegram,
                hasFacebook,
                hasReddit,
              ].some(Boolean))
          )
            return false;

          return true;
        })
        .map((row, i) => ({ ...row, _rank: i + 1 })),
    refetchInterval: 1000 * 30,
    refetchOnMount: true,
  });
};
