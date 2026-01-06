import type { MutableRefObject } from 'react';
import { USDC_SLUG, USDT_SLUG } from 'services/chains/constants';
import { observeGrpc, requestGrpc } from 'services/grpc/core';
import {
  type Candle,
  MarkerType,
  type Swap,
} from 'services/grpc/proto/delphinus';
import { getPairsCached } from 'services/rest';
import type { Resolution } from 'services/rest/discovery';
import { slugToTokenAddress } from 'services/rest/token-info';
import { cdnCoinIcon } from 'shared/CoinsIcons';
import type {
  DatafeedConfiguration,
  GetMarksCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  Mark,
  ResolutionString,
} from '../../../../public/charting_library';

interface ChartCandle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: number;
}

export const resolutionToSeconds: Record<Resolution, number> = {
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

const checkConvertToUsd = (quote: string, currentValue: boolean) => {
  return quote !== USDT_SLUG && quote !== USDC_SLUG ? currentValue : false;
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
  addSwap,
  setMigratedAt,
  walletsRef,
  convertToUsd,
}: {
  slug: string;
  quote: string;
  network: string;
  totalSupply: number;
  isMarketCap: boolean;
  marksRef: MutableRefObject<Mark[]>;
  addSwap: (...swaps: Swap[]) => void;
  setMigratedAt: (time: number) => void;
  walletsRef: MutableRefObject<string[]>;
  convertToUsd: boolean;
}): IBasicDataFeed => {
  let lastCandle: ChartCandle | undefined;
  let lastRes: Resolution | undefined;
  let noData = false;

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
        exchange: 'goatx.trade',
        listed_exchange: '',

        format: 'price',
        minmov: 1 / 10_000_000,
        fractional: false,
        pricescale: 1,

        has_seconds: true,
        seconds_multipliers: ['1', '5', '15', '30'],

        volume_precision: 2,
        has_intraday: true,
        visible_plots_set: 'ohlcv',
        has_weekly_and_monthly: false,
        supported_resolutions: config.supported_resolutions,
        data_status: 'streaming',
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

      if (noData && res === lastRes) {
        onResult([], { noData: true });
        return;
      }

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
            convertToUsd: checkConvertToUsd(quote, convertToUsd),
          },
        });
        const candles = resp.candles;

        if (resp.symbol?.migratedAt) {
          setMigratedAt(new Date(resp.symbol.migratedAt).getTime() / 1000);
        }

        let chartCandles = candles.map(c => convertToChartCandle(c));
        if (isMarketCap) {
          chartCandles = chartCandles.map(c =>
            convertToMarketCapCandle(c, totalSupply),
          );
        }

        if (periodParams.firstDataRequest || lastRes !== res) {
          lastCandle = chartCandles.at(-1);
          lastRes = res;
        }

        noData = chartCandles.length < periodParams.countBack;
        onResult(chartCandles);

        const swaps = await requestGrpc({
          service: 'delphinus',
          method: 'swapsHistory',
          payload: {
            network,
            asset: slugToTokenAddress(baseSlug),
            startTime: new Date(periodParams.from * 1000).toISOString(),
            endTime: new Date(periodParams.to * 1000).toISOString(),
            wallets: walletsRef.current,
          },
        });
        addSwap(...swaps.swaps);
      } catch (error: any) {
        onError(error.message);
      }
    },
    subscribeBars: (_symbolInfo, _resolution, onTick, listenerGuid) => {
      const unsubscribe = observeGrpc(
        {
          service: 'delphinus',
          method: 'assetEventStream',
          payload: {
            asset: slugToTokenAddress(baseSlug),
            network,
            lastCandleOptions: {
              quote: slugToTokenAddress(quote),
              market: 'SPOT',
              convertToUsd: checkConvertToUsd(quote, convertToUsd),
            },
          },
        },
        {
          next: ({ candle, swap, marker }) => {
            if (!candle) return;
            let chartCandle = convertToChartCandle(candle);
            if (isMarketCap) {
              chartCandle = convertToMarketCapCandle(chartCandle, totalSupply);
            }

            if (marker?.markerType === MarkerType.MIGRATE) {
              setMigratedAt(new Date(marker.relatedAt).getTime() / 1000);
            }

            // For solving detached candles problem
            if (lastCandle) {
              if (lastCandle.time > chartCandle.time) {
                console.warn(
                  'time violating candle. prev time: ',
                  new Date(lastCandle.time),
                  ' current time: ',
                  new Date(chartCandle.time),
                );
                chartCandle.time = lastCandle.time;
              }

              if (chartCandle.time === lastCandle.time) {
                chartCandle.open = lastCandle.open;
                chartCandle.high = Math.max(lastCandle.high, chartCandle.high);
                chartCandle.low = Math.min(lastCandle.low, chartCandle.low);
              } else {
                chartCandle.open = lastCandle.close;
              }

              lastCandle = { ...chartCandle };
              onTick(chartCandle);
            }

            if (swap) {
              addSwap(swap);
            }
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
