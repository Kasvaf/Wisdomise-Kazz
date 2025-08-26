import { useLastCandleQuery } from 'api';
import { useSymbolInfo } from 'api/symbol';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useMemo } from 'react';
import { useDebounce } from 'usehooks-ts';

const useCoinPoolInfo = (slug: string) => {
  const [pageQuote] = useActiveQuote();
  const quote = useDebounce(pageQuote, 300);
  const lastCandle = useLastCandleQuery({ slug, quote });
  const info = useSymbolInfo(slug);

  const net = info.data?.networks.find(
    x => x.network.slug === lastCandle.data?.symbol?.network,
  );

  return useMemo(
    () => ({
      isLoading: lastCandle.isLoading || info.isLoading,
      data:
        net && info.data?.name && lastCandle.data?.symbol?.poolAddress
          ? {
              slug,
              quote,
              symbolName: info.data.name,
              network: net.network.slug,
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
