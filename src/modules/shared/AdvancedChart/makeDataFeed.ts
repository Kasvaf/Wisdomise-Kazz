import { getPairsCached } from 'api';
import { cdnCoinIcon } from 'shared/CoinsIcons';
import {
  type ResolutionString,
  type LibrarySymbolInfo,
  type IBasicDataFeed,
  type DatafeedConfiguration,
} from './charting_library/charting_library';
import getCandlesCached, { durs, type Resolution } from './getCandlesCached';

const resMap: Record<string, Resolution> = Object.fromEntries(
  Object.entries(durs).map(([x, y]) => [y / 60, x as Resolution]),
);

const config: DatafeedConfiguration = {
  // Represents the resolutions for bars supported by your datafeed
  // '5m' | '15m' | '30m' | '1h'
  supported_resolutions: Object.keys(resMap) as ResolutionString[],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [{ value: 'Binance', name: 'Binance', desc: 'Binance' }],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: [{ name: 'crypto', value: 'crypto' }],
};

const makeDataFeed = ({
  slug: baseSlug,
  quote,
  pool,
  token,
  network,
}: {
  slug: string;
  quote: string;
  pool: string;
  token: string;
  network: string;
}): IBasicDataFeed => {
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
          exchange: 'Binance',
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
        exchange: 'Binance',
        listed_exchange: 'Binance',
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
      if (!resMap[resolution]) return onError('Unsupported');

      try {
        const data = await getCandlesCached({
          network,
          pool,
          token,
          resolution: resMap[resolution],
          startDateTime: periodParams.from,
          endDateTime: periodParams.to,
        });

        onResult(
          data
            .map(c => ({
              open: c.open,
              close: c.close,
              low: c.low,
              high: c.high,
              time: +new Date(c.related_at),
              volume: c.volume,
            }))
            .reverse(),
          { noData: !data?.length },
        );
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
