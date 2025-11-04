import { useLastCandleStream } from 'api';
import { useTokenInfo } from 'api/token-info';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useMemo } from 'react';
import { useDebounce } from 'usehooks-ts';

const useCoinPoolInfo = (slug: string) => {
  const [pageQuote] = useActiveQuote();
  const quote = useDebounce(pageQuote, 300);
  const lastCandle = useLastCandleStream({ slug, quote });
  const info = useTokenInfo({ slug });

  const net = info.data?.network;

  return useMemo(
    () => ({
      isLoading: lastCandle.isLoading || info.isLoading,
      data:
        net && info.data?.name && lastCandle.data?.symbol?.poolAddress
          ? {
              slug,
              quote,
              symbolName: info.data.name,
              network: net,
            }
          : undefined,
    }),
    [
      net,
      slug,
      quote,
      info.isLoading,
      info.data?.name,
      lastCandle.isLoading,
      lastCandle.data?.symbol?.poolAddress,
    ],
  );
};

export default useCoinPoolInfo;
