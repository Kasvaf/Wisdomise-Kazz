import { getPairsCached } from 'api';
import type { Resolution } from 'api/discovery';
import { observeGrpc, requestGrpc } from 'api/grpc-v2';
import type { Candle } from 'api/proto/delphinus';
import type { MutableRefObject } from 'react';
import { cdnCoinIcon } from 'shared/CoinsIcons';
import { isProduction } from 'utils/version';
import type {
  GetMarksCallback,
  Mark,
} from '../../../../public/charting_library';
import type {
  DatafeedConfiguration,
  IBasicDataFeed,
  LibrarySymbolInfo,
  ResolutionString,
} from './charting_library/charting_library';

interface ChartCandle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: number;
}

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
  supported_resolutions: Object.keys(minutesToResolution) as ResolutionString[],
  supports_marks: true,
};

const checkConvertToUsd = (quote: string) => {
  return quote !== 'tether' && quote !== 'usd-coin'
    ? localStorage.getItem('tv-convert-to-usd') === 'true'
    : false;
};

const convertToChartCandle = (candle: Candle): ChartCandle => {
  return {
    open: +candle.open,
    high: +candle.high,
    low: +candle.low,
    close: +candle.close,
    volume: +candle.volume,
    time: +new Date(candle.relatedAt),
  };
};

const convertToMarketCapCandle = (candle: ChartCandle, totalSupply: number) => {
  return {
    ...candle,
    open: candle.open * totalSupply,
    high: candle.high * totalSupply,
    low: candle.low * totalSupply,
    close: candle.close * totalSupply,
  };
};

const makeDataFeed = ({
  slug: baseSlug,
  quote,
  network,
  totalSupply,
  isMarketCap,
  marksRef,
}: {
  slug: string;
  quote: string;
  network: string;
  totalSupply: number;
  isMarketCap: boolean;
  marksRef: MutableRefObject<Mark[]>;
}): IBasicDataFeed => {
  let lastCandle: ChartCandle | undefined;
  let lastRes: Resolution | undefined;

  return {
    onReady: async callback => {
      await getPairsCached(baseSlug);
      callback(config);
    },
    searchSymbols: async (userInput, _exchange, _symbolType, onResult) => {
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
        pricescale: isMarketCap ? 10_000 : 10_000_000,
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
      _symbolInfo,
      resolution,
      periodParams,
      onResult,
      onError,
    ) => {
      const res = minutesToResolution[resolution];
      if (!res) return onError('Unsupported');

      try {
        const resp = await requestGrpc({
          service: 'delphinus',
          method: 'getCandles',
          payload: {
            market: 'SPOT',
            network,
            baseSlug,
            quoteSlug: quote,
            resolution: res,
            endTime: new Date(periodParams.to * 1000).toISOString(),
            limit: Math.min(periodParams.countBack, 1000),
            skipEmptyCandles: true,
            convertToUsd: checkConvertToUsd(quote),
          },
        });
        const candles = resp.candles;

        let chartCandles = candles.map(c => convertToChartCandle(c));
        if (isMarketCap) {
          chartCandles = chartCandles.map(c =>
            convertToMarketCapCandle(c, totalSupply),
          );
        }

        if (periodParams.firstDataRequest || lastRes !== res) {
          lastCandle = chartCandles.at(res === '1s' ? -2 : -1);
          lastRes = res;
        }

        onResult(chartCandles, {
          noData: chartCandles.length < periodParams.countBack,
        });
      } catch (error: any) {
        onError(error.message);
      }
    },
    subscribeBars: (_symbolInfo, _resolution, onTick, listenerGuid) => {
      const unsubscribe = observeGrpc(
        {
          service: 'delphinus',
          method: 'lastCandleStream',
          payload: {
            market: 'SPOT',
            network,
            baseSlug,
            quoteSlug: quote,
            convertToUsd: checkConvertToUsd(quote),
          },
        },
        {
          next: ({ candle }) => {
            if (!candle) return;
            let chartCandle = convertToChartCandle(candle);
            if (isMarketCap) {
              chartCandle = convertToMarketCapCandle(chartCandle, totalSupply);
            }

            // For solving detached candles problem
            if (lastCandle && isProduction) {
              if (chartCandle.time === lastCandle.time) {
                chartCandle.open = lastCandle.open;
              } else {
                chartCandle.open = lastCandle.close;
              }
              lastCandle = chartCandle;
            }
            onTick(chartCandle);
          },
        },
      );
      listeners[listenerGuid] = () => unsubscribe();
    },
    unsubscribeBars: listenerGuid => listeners[listenerGuid]?.(),
    getMarks(
      _symbolInfo: LibrarySymbolInfo,
      _from: number,
      _to: number,
      onDataCallback: GetMarksCallback<Mark>,
      _resolution: ResolutionString,
    ) {
      onDataCallback(marksRef.current);
    },
  };
};

const listeners: Record<string, () => void> = {};

export default makeDataFeed;
