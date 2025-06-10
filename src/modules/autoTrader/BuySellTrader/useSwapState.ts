import { useState } from 'react';
import { useLastPriceQuery, useSupportedNetworks } from 'api';
import { useAccountBalance } from 'api/chains';
import { useSymbolInfo } from 'api/symbol';
import { roundSensible } from 'utils/numbers';
import { type TraderInputs } from '../PageTrade/types';

const useSwapState = ({ quote, setQuote }: TraderInputs) => {
  const [base, setBase] = useState<string>();
  const [dir, setDir] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('0');
  const [isMarketPrice, setIsMarketPrice] = useState(true);
  const [p, setPercentage] = useState('10');
  const confirming = useState(false);
  const firing = useState(false);
  const percentage = isMarketPrice ? '0' : p;

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

    price: quotePrice,
    priceByOther:
      basePriceByQuote === undefined ? undefined : 1 / basePriceByQuote,
    amount,
  };

  const baseFields = {
    slug: base,
    setSlug: setBase,
    balance: baseBalance,
    balanceLoading: baseLoading,
    coinInfo: baseInfo,

    price: basePrice,
    finalPrice:
      (Number(basePrice) *
        (100 + (dir === 'buy' ? -1 : 1) * Number(percentage))) /
      100,
    priceByOther: basePriceByQuote,
    amount,
  };

  const from = dir === 'buy' ? quoteFields : baseFields;
  const to = dir === 'buy' ? baseFields : quoteFields;

  to.amount = roundSensible(
    (+amount * Number(from.priceByOther) * (100 + Number(percentage))) / 100,
  );

  return {
    selectedNet,

    base: baseFields,
    quote: quoteFields,
    setAmount,

    percentage,
    setPercentage,

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
