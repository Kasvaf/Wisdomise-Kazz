import { useCallback, useEffect, useState } from 'react';
import {
  useLastPriceQuery,
  useSupportedNetworks,
  useSupportedPairs,
} from 'api';
import { type AutoTraderSupportedQuotes, useAccountBalance } from 'api/chains';
import { useSymbolInfo, useSymbolsInfo } from 'api/symbol';

const useSwapState = () => {
  const [base, setBase] = useState<string>();
  const [quote, setQuote] = useState<AutoTraderSupportedQuotes>('tether');

  const [dir, setDir] = useState<'buy' | 'sell'>('buy');
  const { data: baseInfo } = useSymbolInfo(base);
  const { data: quoteInfo } = useSymbolInfo(quote);
  const [isMarketPrice, setIsMarketPrice] = useState(true);
  const [quoteAmount, setQuoteAmount] = useState('100');
  const [baseAmount, setBaseAmount] = useState('100');
  const networks = useSupportedNetworks(base, quote);
  const selectedNet = networks?.[0] ?? 'solana';

  const { data: pairs } = useSupportedPairs(base);
  const firstQuote = pairs?.[0]?.quote?.slug;
  useEffect(() => {
    if (firstQuote) {
      setQuote(firstQuote as AutoTraderSupportedQuotes);
    }
  }, [firstQuote]);
  const supportedQuotes = useSymbolsInfo(pairs?.map(x => x.quote.slug));

  const { data: quoteBalance } = useAccountBalance(quote, selectedNet);
  const { data: baseBalance } = useAccountBalance(base, selectedNet);

  const { data: basePriceByQuote } = useLastPriceQuery({
    slug: base,
    quote,
    convertToUsd: false,
  });

  const { data: basePrice } = useLastPriceQuery({
    slug: base,
    quote,
    convertToUsd: true,
  });

  const { data: quotePrice } = useLastPriceQuery({
    slug: quote,
    convertToUsd: true,
  });

  const quoteFields = {
    balance: quoteBalance,
    coin: quote as string,
    coinInfo: quoteInfo,
    setCoin: setQuote,
    useCoinList: useCallback(() => supportedQuotes, [supportedQuotes]),

    amount: quoteAmount,
    setAmount: setQuoteAmount,
    price: quotePrice,
    priceByOther:
      basePriceByQuote === undefined ? undefined : 1 / basePriceByQuote,
  };

  const baseFields = {
    balance: baseBalance,
    coin: base,
    coinInfo: baseInfo,
    setCoin: undefined,
    useCoinList: undefined,

    amount: baseAmount,
    setAmount: setBaseAmount,
    price: basePrice,
    priceByOther: basePriceByQuote,
  };

  const from = dir === 'buy' ? quoteFields : baseFields;
  const to = dir === 'buy' ? baseFields : quoteFields;

  return {
    selectedNet,
    base,
    setBase,
    quote,
    setQuote,
    from,
    to,

    quoteAmount,
    baseAmount,

    dir,
    swapFromTo: useCallback(() => {
      setDir(dir => (dir === 'buy' ? 'sell' : 'buy'));
      setIsMarketPrice(true);
    }, []),

    isMarketPrice,
    setIsMarketPrice,
  };
};

export type SwapState = ReturnType<typeof useSwapState>;
export default useSwapState;
