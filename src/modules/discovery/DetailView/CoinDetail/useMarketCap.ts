import { useLastCandleStream } from 'api';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useTotalSupply } from 'modules/discovery/DetailView/CoinDetail/useTotalSupply';
import { useMemo } from 'react';

export const useMarketCap = ({
  convertToUsd = true,
}: {
  convertToUsd?: boolean;
}) => {
  const { totalSupply } = useTotalSupply();
  const { symbol } = useUnifiedCoinDetails();
  const [quote] = useActiveQuote();
  const network = useActiveNetwork();
  const { data: lastCandle, isLoading } = useLastCandleStream({
    market: 'SPOT',
    network: network as 'solana' | 'the-open-network',
    slug: symbol.slug,
    quote,
    convertToUsd,
  });

  return useMemo(
    () => ({
      isLoading,
      data: Number(lastCandle?.candle?.close ?? '0') * (totalSupply ?? 0),
    }),
    [lastCandle, isLoading, totalSupply],
  );
};
