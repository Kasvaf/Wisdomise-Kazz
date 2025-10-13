import {
  USDC_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  WRAPPED_SOLANA_CONTRACT_ADDRESS,
} from 'api/chains/constants';
import { useGrpc } from 'api/grpc-v2';
import type { Swap } from 'api/proto/delphinus';
import { useTrackerHistoryQuery } from 'api/tracker';
import { useMemo } from 'react';
import { toCamelCaseObject } from 'utils/object';
import { uniqueBy } from 'utils/uniqueBy';

const QUOTES_ADDRESSES = [
  WRAPPED_SOLANA_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
];

export const useEnrichedSwaps = ({
  tokenAddress,
  network,
  wallets,
  enabled = true,
}: {
  tokenAddress?: string;
  wallets?: string[];
  network: string;
  enabled?: boolean;
}) => {
  const { data: history, isLoading: l1 } = useGrpc({
    service: 'delphinus',
    method: 'swapsHistory',
    payload: {
      network,
      asset: tokenAddress,
    },
    enabled: enabled && !wallets,
    history: 0,
  });

  const { history: streamHistory, isLoading: l2 } = useGrpc({
    service: 'delphinus',
    method: 'swapsStream',
    payload: {
      network,
      asset: tokenAddress,
      wallets,
      enrichAssetDetails: !!wallets,
    },
    enabled,
    history: Number.POSITIVE_INFINITY,
  });

  const { data: trackerHistory, isLoading: l3 } = useTrackerHistoryQuery({});

  const data = useMemo(() => {
    const swaps = uniqueBy(
      [
        ...(streamHistory?.map(x => x.swap) ?? []),
        ...(history?.swaps ?? []),
        ...(trackerHistory?.results ?? []),
      ]
        .filter(s => !!s)
        .map(s => ('relatedAt' in s ? s : toCamelCaseObject<Swap>(s)))
        .sort((a, b) => +new Date(b.relatedAt) - +new Date(a.relatedAt)),
      x => x.id,
    );

    return swaps.map(row => {
      const dir = QUOTES_ADDRESSES.includes(row.toAsset) ? 'sell' : 'buy';
      const price = +(
        (dir === 'sell' ? row.fromAssetPrice : row.toAssetPrice) ?? '0'
      );

      const asset = dir === 'sell' ? row.fromAsset : row.toAsset;
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
        asset,
        assetDetail,
      };
    });
  }, [history, streamHistory, trackerHistory]);

  return {
    data,
    isLoading: l1 || l2 || l3,
  };
};
