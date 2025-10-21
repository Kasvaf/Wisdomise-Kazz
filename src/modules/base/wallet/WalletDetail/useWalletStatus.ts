import { useWalletStatusQuery } from 'api/wallets';
import { useMemo } from 'react';

export const useWalletStatus = ({
  address,
  resolution,
  network = 'solana',
}: {
  address?: string;
  resolution: '1d' | '7d' | '30d';
  network?: 'solana';
}) => {
  const query = useWalletStatusQuery({
    address,
    resolution,
    network,
  });

  return useMemo(() => {
    const data = query.data;
    const tokens = data ? Object.values(data) : undefined;

    const realizedPnl = tokens?.reduce(
      (sum, current) => sum + current.realized_pnl,
      0,
    );
    const totalBought = tokens?.reduce(
      (sum, current) => sum + current.volume_inflow,
      0,
    );

    const realizedPnlPercentage =
      realizedPnl && totalBought ? (realizedPnl / totalBought) * 100 : 0;

    const numBuys = tokens?.reduce((sum, current) => sum + current.num_buys, 0);
    const numSells = tokens?.reduce(
      (sum, current) => sum + current.num_sells,
      0,
    );

    const positiveTokensCount = tokens?.filter(t => t.realized_pnl > 0)?.length;
    const winRate = positiveTokensCount
      ? (positiveTokensCount / tokens.length) * 100
      : 0;

    return {
      ...query,
      tokens,
      realizedPnl,
      totalBought,
      realizedPnlPercentage,
      numBuys,
      numSells,
      winRate,
    };
  }, [query, query.data]);
};
