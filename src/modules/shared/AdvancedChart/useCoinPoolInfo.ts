import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useMemo } from 'react';
import { useLastPriceStream } from 'services/price';
import { useDebounce } from 'usehooks-ts';

const useCoinPoolInfo = (slug: string) => {
  const [pageQuote] = useActiveQuote();
  const quote = useDebounce(pageQuote, 300);
  const lastPrice = useLastPriceStream({ slug, quote });

  const net = 'solana';

  return useMemo(
    () => ({
      isLoading: lastPrice.isLoading,
      data: net
        ? {
            slug,
            quote,
            network: net,
          }
        : undefined,
    }),
    [slug, quote, lastPrice.isLoading],
  );
};

export default useCoinPoolInfo;
