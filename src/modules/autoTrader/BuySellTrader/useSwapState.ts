import { useEffect, useState } from 'react';
import { useLastPriceQuery, useSupportedNetworks } from 'api';
import { useAccountBalance } from 'api/chains';
import { useSymbolInfo } from 'api/symbol';
import { type TraderInputs } from '../PageTrade/types';

const useSwapState = ({ quote, setQuote }: TraderInputs) => {
  const [base, setBase] = useState<string>();
  const [dir, setDir] = useState<'buy' | 'sell'>('buy');
  const [quoteAmount, setQuoteAmount] = useState('0');
  const [baseAmount, setBaseAmount] = useState('0');
  const [isMarketPrice, setIsMarketPrice] = useState(true);
  const confirming = useState(false);
  const firing = useState(false);

  const { data: baseInfo } = useSymbolInfo(base);
  const { data: quoteInfo } = useSymbolInfo(quote);
  const networks = useSupportedNetworks(base, quote);
  const selectedNet = networks?.[0] ?? 'solana';

  const { data: quoteBalance, isLoading: quoteLoading } = useAccountBalance(
    quote,
    selectedNet,
  );
  const { data: baseBalance, isLoading: baseLoading } = useAccountBalance(
    base,
    selectedNet,
  );

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
    slug: quote,
    setSlug: setQuote,
    balance: quoteBalance,
    balanceLoading: quoteLoading,
    coinInfo: quoteInfo,

    amount: quoteAmount,
    setAmount: setQuoteAmount,
    price: quotePrice,
    priceByOther:
      basePriceByQuote === undefined ? undefined : 1 / basePriceByQuote,
  };

  const baseFields = {
    slug: base,
    setSlug: setBase,
    balance: baseBalance,
    balanceLoading: baseLoading,
    coinInfo: baseInfo,

    amount: baseAmount,
    setAmount: setBaseAmount,
    price: basePrice,
    priceByOther: basePriceByQuote,
  };

  const from = dir === 'buy' ? quoteFields : baseFields;
  const to = dir === 'buy' ? baseFields : quoteFields;

  // make sure amount is always less than balance
  const fb = from.balance;
  const fa = +from.amount;
  const setFa = from.setAmount;
  useEffect(() => {
    if (fb != null && fa > fb) {
      setFa(String(fb));
    }
  }, [fa, fb, setFa]);

  return {
    selectedNet,

    base: baseFields,
    quote: quoteFields,

    dir,
    setDir,

    isMarketPrice,
    setIsMarketPrice,

    from,
    to,

    confirming,
    firing,
  };
};

export type SwapState = ReturnType<typeof useSwapState>;
export default useSwapState;
