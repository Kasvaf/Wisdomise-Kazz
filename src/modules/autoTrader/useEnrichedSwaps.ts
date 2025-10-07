import { SOLANA_CONTRACT_ADDRESS } from 'api/chains/constants';
import { useGrpc } from 'api/grpc-v2';
import type { Swap } from 'api/proto/delphinus';
import { useTrackerHistoryQuery } from 'api/tracker';
import { useMemo } from 'react';
import { uniqueBy } from 'utils/uniqueBy';

export const useEnrichedSwaps = ({
  asset,
  network,
  wallets,
  enabled = true,
}: {
  asset?: string;
  wallets?: string[];
  network: string;
  enabled?: boolean;
}) => {
  const { data: history, isLoading: l1 } = useGrpc({
    service: 'delphinus',
    method: 'swapsHistory',
    payload: {
      network,
      asset,
    },
    enabled: enabled && !wallets,
    history: 0,
  });

  const { history: streamHistory, isLoading: l2 } = useGrpc({
    service: 'delphinus',
    method: 'swapsStream',
    payload: {
      network,
      asset,
      wallets,
      enrichAssetDetails: false,
    },
    enabled: false,
    history: Number.POSITIVE_INFINITY,
  });

  const { data: trackerHistory, isLoading: l3 } = useTrackerHistoryQuery({});

  console.log({ history, streamHistory, trackerHistory });

  const data = useMemo(() => {
    const swaps = uniqueBy(
      [
        ...(streamHistory?.map(x => x.swap) ?? []),
        ...(history?.swaps ?? []),
        ...(trackerHistory?.results ?? []),
      ]
        .filter((x): x is Swap => !!x)
        .sort((a, b) => +new Date(b.relatedAt) - +new Date(a.relatedAt)),
      x => x.id,
    );

    return swaps.map(row => {
      const dir = row.toAsset === SOLANA_CONTRACT_ADDRESS ? 'sell' : 'buy';
      const price = +(
        (dir === 'sell' ? row.fromAssetPrice : row.toAssetPrice) ?? '0'
      );

      const tokenAddress = dir === 'sell' ? row.fromAsset : row.toAsset;
      const tokenAmount = +(dir === 'sell' ? row.fromAmount : row.toAmount);
      const solAmount = +(dir === 'sell' ? row.toAmount : row.fromAmount);
      const assetDetail =
        dir === 'sell' ? row.fromAssetDetails : row.toAssetDetails;
      return {
        ...row,
        dir,
        price,
        tokenAmount,
        solAmount,
        tokenAddress,
        assetDetail,
      };
    });
  }, [history, streamHistory, trackerHistory]);

  console.log(l1, l2, l3);

  return {
    data,
    isLoading: l1 || l3,
  };
};
