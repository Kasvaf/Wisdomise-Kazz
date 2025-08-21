import { useLastPriceQuery, useSupportedNetworks } from 'api';
import { useAccountBalance } from 'api/chains';
import { useCoinDetails } from 'api/discovery';
import { useSymbolInfo } from 'api/symbol';
import { useCallback, useEffect, useState } from 'react';
import { roundSensible } from 'utils/numbers';
import type { TraderInputs } from '../PageTrade/types';

const useSwapState = ({ quote, setQuote }: TraderInputs) => {
  const [base, setBase] = useState<string>();
  const [dir, setDir] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('0');
  const [isMarketPrice, setIsMarketPrice] = useState(true);
  const [limit, setLimit] = useState('');
  const [limitType, setLimitType] = useState<'price' | 'market_cap'>('price');
  const confirming = useState(false);
  const firing = useState(false);
  const { data: details } = useCoinDetails({ slug: base });

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

  const marketCap = (basePrice ?? 0) * (details?.data?.total_supply ?? 0);
  const percentage = isMarketPrice
    ? 0
    : Math.abs(
        limitType === 'price'
          ? (((basePriceByQuote ?? 0) - +limit) * 100) / (basePriceByQuote ?? 1)
          : ((marketCap - +limit) * 100) / marketCap,
      );

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
    finalPriceDollar:
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

  const updateLimit = useCallback(() => {
    if (basePriceByQuote && marketCap) {
      setLimit(
        limitType === 'price'
          ? roundSensible(basePriceByQuote)
          : String(marketCap),
      );
    }
  }, [basePriceByQuote, limitType, marketCap]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (!limit) {
      updateLimit();
    }
  }, [basePriceByQuote, limit, limitType, marketCap, updateLimit]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    updateLimit();
  }, [quote, limitType, isMarketPrice]);

  return {
    selectedNet,

    base: baseFields,
    quote: quoteFields,
    setAmount,

    percentage,

    limit,
    setLimit,
    limitType,
    setLimitType,

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
