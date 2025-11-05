import { useLastCandleStream } from 'api';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useMemo } from 'react';
import { useDebounce } from 'usehooks-ts';

const useCoinPoolInfo = (slug: string) => {
  const [pageQuote] = useActiveQuote();
  const quote = useDebounce(pageQuote, 300);
  const lastCandle = useLastCandleStream({ slug, quote });

  const net = 'solana';

  return useMemo(
    () => ({
      isLoading: lastCandle.isLoading,
      data:
        net && lastCandle.data?.symbol?.poolAddress
          ? {
              slug,
              quote,
              network: net,
            }
          : undefined,
    }),
    [slug, quote, lastCandle.isLoading, lastCandle.data?.symbol?.poolAddress],
  );
};

export default useCoinPoolInfo;
