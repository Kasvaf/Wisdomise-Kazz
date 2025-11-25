import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useMemo } from 'react';
import {
  USDC_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  WRAPPED_SOLANA_CONTRACT_ADDRESS,
} from 'services/chains/constants';
import { useAssetEventStream } from 'services/grpc/assetEvent';
import { useGrpc } from 'services/grpc/core';
import type { Swap } from 'services/grpc/proto/delphinus';
import { slugToTokenAddress } from 'services/rest/token-info';
import { useTrackerHistoryQuery } from 'services/rest/tracker';
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
  const [quote] = useActiveQuote();
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

  const { history: streamHistory2 } = useAssetEventStream({
    payload: {
      network,
      asset: tokenAddress!,
      lastCandleOptions: {
        quote: slugToTokenAddress(quote),
        market: 'SPOT',
        convertToUsd: false,
      },
    },
    enabled: !!tokenAddress && enabled && !wallets,
    history: 200,
  });

  const { history: streamHistory } = useGrpc({
    service: 'delphinus',
    method: 'swapsStream',
    payload: {
      network,
      asset: tokenAddress,
      wallets,
      enrichAssetDetails: !!wallets,
    },
    enabled: enabled && !!wallets,
    history: 200,
  });

  const { data: trackerHistory, isLoading: l2 } = useTrackerHistoryQuery({
    enabled: !!wallets,
  });

  const data = useMemo(() => {
    const swaps =
      history || trackerHistory
        ? uniqueBy(
            [
              ...(streamHistory?.map(x => x.swap).toReversed() ?? []),
              ...(streamHistory2?.map(x => x.swap).toReversed() ?? []),
              ...(history?.swaps ?? []),
              ...(wallets ? (trackerHistory?.results ?? []) : []),
            ]
              .filter(s => !!s)
              .map(s => ('relatedAt' in s ? s : toCamelCaseObject<Swap>(s)))
              .filter(s => !SwapAssetsAreBothQuotes(s)),
            x => x.txId,
          )
        : [];

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
  }, [history, streamHistory, trackerHistory, wallets, streamHistory2]);

  return {
    data,
    isLoading: l1 || l2,
  };
};

const SwapAssetsAreBothQuotes = (s: Swap) => {
  return (
    QUOTES_ADDRESSES.includes(s.toAsset) &&
    QUOTES_ADDRESSES.includes(s.fromAsset)
  );
};
