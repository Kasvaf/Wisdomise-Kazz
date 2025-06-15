import { getPairsCached } from 'api';
import { cdnCoinIcon } from 'shared/CoinsIcons';
import { type DelphinusServiceClientImpl } from 'api/proto/delphinus';
import {
  type ResolutionString,
  type LibrarySymbolInfo,
  type IBasicDataFeed,
  type DatafeedConfiguration,
} from './charting_library/charting_library';
import getCandlesCached, { type Resolution } from './getCandlesCached';

export const resolutionToSeconds: Record<Resolution, number> = {
  '1m': 60,
  '5m': 60 * 5,
  '15m': 60 * 15,
  '30m': 60 * 30,
  '1h': 60 * 60,
  '4h': 60 * 60 * 4,
};

const minutesToResolution: Record<string, Resolution> = Object.fromEntries(
  Object.entries(resolutionToSeconds).map(([x, y]) => [
    y / 60,
    x as Resolution,
  ]),
);

const config: DatafeedConfiguration = {
  // Represents the resolutions for bars supported by your datafeed
  // '5m' | '15m' | '30m' | '1h'
  supported_resolutions: Object.keys(minutesToResolution) as ResolutionString[],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [{ value: 'Binance', name: 'Binance', desc: 'Binance' }],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: [{ name: 'crypto', value: 'crypto' }],
};

const makeDataFeed = (
  delphinus: DelphinusServiceClientImpl,
  {
    slug: baseSlug,
    quote,
    network,
  }: {
    slug: string;
    quote: string;
    network: string;
  },
): IBasicDataFeed => {
  return {
    onReady: async callback => {
      await getPairsCached(baseSlug);
      callback(config);
    },
    searchSymbols: async (userInput, exchange, symbolType, onResult) => {
      const pairs = await getPairsCached(baseSlug);
      const matchedPairs = pairs
        .filter(x => x.name.toLowerCase().includes(userInput.toLowerCase()))
        .map(c => ({
          ticker: c.name,
          symbol: c.base.name || c.name,
          full_name: c.name,
          description: c.name,
          exchange: '',
          type: 'crypto',
          logo_urls: c.base.name
            ? ([cdnCoinIcon(c.base.name.toLowerCase())] as [string])
            : undefined,
        }));
      onResult(matchedPairs);
    },
    resolveSymbol: async (symbolName, onResolve, onError) => {
      const pairs = await getPairsCached(baseSlug);
      const pair = pairs.find(
        x =>
          x.name === symbolName ||
          (x.base.name === symbolName && x.quote.slug === quote),
      );
      if (!pair) {
        onError('Not found');
        return;
      }

      const symbolInfo = {
        ticker: symbolName,
        name: pair.name,
        description: pair.name,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: '',
        listed_exchange: '',
        format: 'volume',

        minmov: 1,
        fractional: false,
        pricescale: 100_000,

        volume_precision: 2,
        has_intraday: true,
        visible_plots_set: 'ohlcv',
        has_weekly_and_monthly: false,
        supported_resolutions: config.supported_resolutions,
        data_status: 'streaming',
        logo_urls: pair.base.name
          ? ([cdnCoinIcon(pair.base.name.toLowerCase())] as const)
          : undefined,
      } satisfies LibrarySymbolInfo;
      onResolve(symbolInfo);
    },
    getBars: async (
      symbolInfo,
      resolution,
      periodParams,
      onResult,
      onError,
    ) => {
      const res = minutesToResolution[resolution];
      if (!res) return onError('Unsupported');

      try {
        const dur = resolutionToSeconds[res];
        const endTime = Math.round(periodParams.to / dur) * dur;
        const startTime =
          endTime -
          Math.min(1000, endTime / dur - Math.round(periodParams.from / dur)) *
            dur;

        const bars = await getCandlesCached(delphinus, {
          market: 'SPOT',
          network,
          baseSlug,
          quoteSlug: quote,
          resolution: res,
          startTime: new Date(startTime * 1000).toISOString(),
          endTime: new Date(endTime * 1000).toISOString(),
          skipEmptyCandles: true,
        });

        onResult(bars, {
          noData: !bars?.length,
          nextTime:
            startTime > 1000 && bars.length > 0
              ? bars[0].time / 1000 - startTime
              : undefined,
        });
      } catch (error: any) {
        onError(error.message);
      }
    },
    subscribeBars: noop,
    unsubscribeBars: noop,
  };
};

export default makeDataFeed;

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}
