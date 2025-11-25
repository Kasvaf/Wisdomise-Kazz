import { useActiveNetwork } from 'modules/base/active-network';
import {
  USDC_CONTRACT_ADDRESS,
  USDC_SLUG,
  USDT_CONTRACT_ADDRESS,
  USDT_SLUG,
  WRAPPED_SOLANA_CONTRACT_ADDRESS,
} from 'services/chains/constants';
import { useAssetEventStream } from 'services/grpc/assetEvent';
import { useBatchCandlesQuery, useTokenPairsQuery } from 'services/rest';
import { slugToTokenAddress } from 'services/rest/token-info';
import type { MarketTypes } from 'services/rest/types/shared';

interface LastCandleParams {
  slug?: string; // slug
  quote?: string;
  network?: 'solana' | 'the-open-network' | 'polygon';
  market?: MarketTypes;
  convertToUsd?: boolean;
  debug?: boolean;
}

export const useLastCandleStream = ({
  network,
  slug: base,
  quote,
  market = 'SPOT',
  convertToUsd = !quote,
}: LastCandleParams) => {
  const { data: supportedPairs } = useTokenPairsQuery(base);

  // list of all quote+networks for this base-slug
  const netPairs = supportedPairs?.flatMap(sp =>
    sp.network_slugs.map(net => ({
      quote: sp.quote.slug,
      net,
    })),
  );

  // first pair that matches both quote and active-network
  const activeNet = useActiveNetwork();
  const net = network || activeNet;

  const bestPair =
    netPairs?.find(
      x => (!quote || x.quote === quote) && (!net || x.net === net),
    ) ||
    // first pair that matches a quote, with a well-known exchange (net is not active)
    netPairs?.find(
      x =>
        (!quote || x.quote === quote) &&
        (x.net === 'the-open-network' || x.net === 'solana'),
    ) ||
    netPairs?.[0];

  const theQuote = bestPair?.quote;
  const bestNet = network || bestPair?.net;

  return useAssetEventStream({
    payload: {
      asset: slugToTokenAddress(base),
      network: bestNet,
      lastCandleOptions: {
        quote: slugToTokenAddress(theQuote),
        market: 'SPOT',
        convertToUsd,
      },
    },
    enabled: Boolean(base && theQuote && bestNet && market),
    history: 0,
  });
};

export const useLastPriceStream = (params: LastCandleParams) => {
  const { data, ...rest } = useLastCandleStream(params);

  return {
    ...rest,
    data: data?.candle?.close ? Number(data?.candle?.close) : undefined,
  };
};

const _useUSDTLastPriceStream = () => {
  return useLastPriceStream({ slug: USDT_SLUG, quote: USDC_SLUG });
};

const _useUSDCLastPriceStream = () => {
  return useLastPriceStream({ slug: USDC_SLUG, quote: USDT_SLUG });
};

export const useBatchLastPriceQuery = ({
  bases,
  network,
}: {
  bases?: string[];
  network: 'solana' | 'the-open-network';
}) => {
  // const { data: usdtPrice, isLoading: l1 } = useUSDTLastPriceStream();
  // const { data: usdcPrice, isLoading: l2 } = useUSDCLastPriceStream();

  const noneUsdBases = bases?.filter(
    base => ![USDT_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS].includes(base),
  );

  const quotes = noneUsdBases?.map(base =>
    base === WRAPPED_SOLANA_CONTRACT_ADDRESS
      ? USDC_CONTRACT_ADDRESS
      : WRAPPED_SOLANA_CONTRACT_ADDRESS,
  );

  const { data: batchCandles, isPending } = useBatchCandlesQuery({
    bases: noneUsdBases,
    quotes,
    network,
  });

  return {
    data: bases?.map(
      base =>
        (base === USDC_CONTRACT_ADDRESS
          ? 1
          : base === USDT_CONTRACT_ADDRESS
            ? 1
            : batchCandles?.find(res => res.symbol.base === base)?.candles?.[0]
                ?.close) ?? 0,
    ),
    isPending: isPending,
  };
};
