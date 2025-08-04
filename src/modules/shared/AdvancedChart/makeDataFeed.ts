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

const resolutionToSeconds: Record<Resolution, number> = {
  '1s': 1,
  '5s': 5,
  '15s': 15,
  '30s': 30,
  '1m': 60,
  '5m': 60 * 5,
  '15m': 60 * 15,
  '30m': 60 * 30,
  '1h': 60 * 60,
  '4h': 60 * 60 * 4,
};

const minutesToResolution: Record<string, Resolution> = Object.fromEntries(
  Object.entries(resolutionToSeconds).map(([x, y]) => [
    y < 60 ? `${y}S` : y / 60,
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

const checkConvertToUsd = (quote: string) => {
  return quote !== 'tether' && quote !== 'usd-coin'
    ? localStorage.getItem('tv-convert-to-usd') === 'true'
    : false;
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
      const pair = pairs.find(x => x.quote.slug === quote);
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
        format: 'price',

        minmov: 1,
        fractional: false,
        pricescale: 10_000_000,
        has_seconds: true,
        seconds_multipliers: ['1', '5', '15', '30'],

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
        const start = Math.ceil(periodParams.from / dur);
        const end = Math.ceil(periodParams.to / dur);
        const BATCH_SIZE = 999;

        const all = [];
        for (let i = start; i <= end; i += BATCH_SIZE) {
          all.push(
            getCandlesCached(delphinus, {
              market: 'SPOT',
              network,
              baseSlug,
              quoteSlug: quote,
              resolution: res,
              startTime: new Date(i * dur * 1000).toISOString(),
              endTime: new Date(
                Math.min(end, i + BATCH_SIZE) * dur * 1000,
              ).toISOString(),
              skipEmptyCandles: true,
              convertToUsd: checkConvertToUsd(quote),
            }),
          );
        }

        const bars = (await Promise.all(all)).flat();
        onResult(bars, {
          noData: bars.length === 0,
        });
      } catch (error: any) {
        onError(error.message);
      }
    },
    subscribeBars: (symbolInfo, resolution, onTick, listenerGuid) => {
      const req = delphinus.lastCandleStream({
        market: 'SPOT',
        network,
        baseSlug,
        quoteSlug: quote,
        convertToUsd: checkConvertToUsd(quote),
      });

      function doSub() {
        const sub = req.subscribe(
          ({ candle }) => {
            if (!candle) return;
            onTick({
              open: +candle.open,
              high: +candle.high,
              low: +candle.low,
              close: +candle.close,
              volume: +candle.volume,
              time: +new Date(candle.relatedAt),
            });
          },
          err => {
            console.error(err);
            try {
              sub.unsubscribe();
            } catch {}
            doSub();
          },
        );
        listeners[listenerGuid] = () => sub.unsubscribe();
      }
      doSub();
    },
    unsubscribeBars: listenerGuid => listeners[listenerGuid]?.(),
  };
};

const listeners: Record<string, () => void> = {};

export default makeDataFeed;
