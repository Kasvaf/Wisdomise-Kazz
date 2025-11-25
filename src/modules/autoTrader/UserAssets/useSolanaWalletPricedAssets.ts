import { useSolanaWalletAssets } from 'services/chains/solana';
import { useBatchLastPriceQuery } from 'services/price';

export const useSolanaWalletPricedAssets = (address?: string) => {
  const assetsQuery = useSolanaWalletAssets(address);
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

export const useSolanaWalletBalanceInUSD = (address?: string) => {
  const { data: assets, isPending } = useSolanaWalletPricedAssets(address);
  return {
    balance: isPending
      ? 0
      : (assets?.reduce((sum, curr) => (sum += curr.usd_equity), 0) ?? 0),
    isPending,
  };
};
