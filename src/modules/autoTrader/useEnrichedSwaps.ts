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

export const useTokenSwaps = ({
  tokenAddress,
  network,
  wallets,
  enabled = true,
  startTime,
  endTime,
}: {
  tokenAddress?: string;
  wallets?: string[];
  network: string;
  enabled?: boolean;
  startTime?: string;
  endTime?: string;
}) => {
  const [quote] = useActiveQuote();
  const { data: history, isLoading: l1 } = useGrpc({
    service: 'delphinus',
    method: 'swapsHistory',
    payload: {
      network,
      asset: tokenAddress,
      wallets,
      startTime,
      endTime,
    },
    enabled: enabled,
    history: 0,
  });

  const { history: streamHistory, isLoading: l2 } = useAssetEventStream({
    payload: {
      network,
      asset: tokenAddress!,
      lastCandleOptions: {
        quote: slugToTokenAddress(quote),
        market: 'SPOT',
        convertToUsd: false,
      },
    },
    enabled: !!tokenAddress && enabled,
    history: 200,
  });

  const data = useMemo(() => {
    const swaps = (
      history
        ? uniqueBy(
            [
              ...(streamHistory
                ?.filter(
                  s =>
                    !startTime &&
                    !endTime &&
                    (wallets?.length
                      ? wallets?.includes(s.swap?.wallet ?? '')
                      : true),
                )
                ?.map(x => x.swap)
                .toReversed() ?? []),
              ...(history?.swaps ?? []),
            ]
              .filter(s => !!s)
              .filter(s => !SwapAssetsAreBothQuotes(s)),
            x => x.txId,
          )
        : []
    ).slice(0, 200);

    return swaps.map(row => enrichSwap(row));
  }, [history, streamHistory, wallets, startTime, endTime]);

  return {
    data,
    isLoading: l1 || l2,
  };
};

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
      wallets,
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

    return swaps.map(row => enrichSwap(row));
  }, [history, streamHistory, trackerHistory, wallets, streamHistory2]);

  return {
    data,
    isLoading: l1 || l2,
  };
};

export const enrichSwap = (swap: Swap) => {
  const dir = QUOTES_ADDRESSES.includes(swap.toAsset) ? 'sell' : 'buy';
  const price = +(
    (dir === 'sell' ? swap.fromAssetPrice : swap.toAssetPrice) ?? '0'
  );
  const usdPrice = +(
    (dir === 'sell' ? swap.fromAssetPrice : swap.toAssetPrice) ?? '0'
  );

  const asset = dir === 'sell' ? swap.fromAsset : swap.toAsset;
  const tokenAmount = +(dir === 'sell' ? swap.fromAmount : swap.toAmount);
  const usdAmount = tokenAmount * usdPrice;
  const solAmount = +(dir === 'sell' ? swap.toAmount : swap.fromAmount);
  const assetDetail =
    dir === 'sell' ? swap.fromAssetDetails : swap.toAssetDetails;
  return {
    ...swap,
    dir,
    price,
    usdPrice,
    tokenAmount,
    usdAmount,
    solAmount,
    asset,
    assetDetail,
  };
};

const SwapAssetsAreBothQuotes = (s: Swap) => {
  return (
    QUOTES_ADDRESSES.includes(s.toAsset) &&
    QUOTES_ADDRESSES.includes(s.fromAsset)
  );
};
