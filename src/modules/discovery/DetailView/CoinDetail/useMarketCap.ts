import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useTotalSupply } from 'modules/discovery/DetailView/CoinDetail/useTotalSupply';
import { useMemo } from 'react';
import { useLastPriceStream } from 'services/price';

export const useMarketCap = ({
  convertToUsd = true,
}: {
  convertToUsd?: boolean;
}) => {
  const { totalSupply } = useTotalSupply();
  const { symbol } = useUnifiedCoinDetails();
  const [quote] = useActiveQuote();
  const network = useActiveNetwork();
  const { data: price, isLoading } = useLastPriceStream({
    network,
    slug: symbol.slug,
    quote,
    convertToUsd,
  });

  return useMemo(
    () => ({
      isLoading,
      data: Number(price ?? 0) * (totalSupply ?? 0),
    }),
    [price, isLoading, totalSupply],
  );
};
