import { useBatchLastPriceQuery } from 'api';
import { useSolanaUserRawAssets } from 'api/chains/solana';

export const useSolanaUserAssets = (address?: string) => {
  const assetsQuery = useSolanaUserRawAssets(address);
  const pricesQuery = useBatchLastPriceQuery({
    bases: assetsQuery.data?.map(asset => asset.address),
    network: 'solana',
  });

  return {
    ...assetsQuery,
    data: assetsQuery.data?.map((asset, index) => ({
      ...asset,
      usd_equity: (pricesQuery.data?.[index] ?? 0) * asset.amount,
    })),
  };
};

export const useSolanaBalanceInUSD = (address?: string) => {
  const { data: assets, isPending } = useSolanaUserAssets(address);
  return {
    balance: isPending
      ? 0
      : assets?.reduce((sum, curr) => (sum += curr.usd_equity), 0) ?? 0,
    isPending,
  };
};
