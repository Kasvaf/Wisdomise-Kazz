import { useLastPriceStream, useSupportedNetworks } from 'api';
import { useTokenBalance } from 'api/chains';
import { useTokenInfo } from 'api/token-info';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useCallback, useEffect, useState } from 'react';
import { useChartConvertToUSD } from 'shared/AdvancedChart/chartSettings';
import { roundSensible } from 'utils/numbers';
import type { TraderInputs } from '../PageTrade/types';

const useSwapState = ({ quote, setQuote }: TraderInputs) => {
  const [base, setBase] = useState<string>();
  const [dir, setDir] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('0');
  const [isMarketPrice, setIsMarketPrice] = useState(true);
  const [limit, setLimit] = useState('');
  const [limitType, setLimitType] = useState<'price' | 'market_cap'>(
    'market_cap',
  );
  const confirming = useState(false);
  const firing = useState(false);
  const details = useUnifiedCoinDetails();
  const [convertToUsd] = useChartConvertToUSD();

  const { data: baseInfo } = useTokenInfo({ slug: base });
  const { data: quoteInfo } = useTokenInfo({ slug: quote });
  const networks = useSupportedNetworks(base, quote);
  const selectedNet = networks?.[0] ?? 'solana';

  const { data: quoteBalance, isLoading: quoteLoading } = useTokenBalance({
    slug: quote,
    network: selectedNet,
  });
  const { data: baseBalance, isLoading: baseLoading } = useTokenBalance({
    slug: base,
    network: selectedNet,
  });

  const { data: basePriceByQuote } = useLastPriceStream({
    slug: base,
    quote,
    convertToUsd: false,
  });

  const { data: basePrice } = useLastPriceStream({
    slug: base,
    quote,
    convertToUsd: true,
  });

  const { data: quotePrice } = useLastPriceStream({
    slug: quote,
    convertToUsd: true,
  });

  const marketCap = (basePrice ?? 0) * (details?.marketData?.totalSupply ?? 0);
  const marketCapQuote =
    (basePriceByQuote ?? 0) * (details?.marketData?.totalSupply ?? 0);
  const percentage = isMarketPrice
    ? 0
    : limitType === 'price'
      ? (((basePrice ?? 0) - +limit) * 100) / (basePrice ?? 1)
      : ((marketCap - +limit) * 100) / marketCap;

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
      (Number(convertToUsd ? basePrice : basePriceByQuote) *
        (100 - Number(percentage))) /
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
          ? roundSensible(convertToUsd ? basePrice : basePriceByQuote)
          : String(convertToUsd ? marketCap : marketCapQuote),
      );
    }
  }, [
    basePriceByQuote,
    limitType,
    marketCap,
    marketCapQuote,
    basePrice,
    convertToUsd,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (!limit) {
      updateLimit();
    }
  }, [basePriceByQuote, limit, limitType, marketCap, updateLimit]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    updateLimit();
  }, [quote, limitType, isMarketPrice, convertToUsd]);

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
