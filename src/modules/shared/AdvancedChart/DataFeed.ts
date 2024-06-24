import { type Resolution } from 'api';
import { cdnCoinIcon } from 'shared/CoinsIcons';
import {
  type ResolutionString,
  type LibrarySymbolInfo,
  type IBasicDataFeed,
  type DatafeedConfiguration,
} from './charting_library/charting_library';
import getCandlesCached from './getCandlesCached';
import getAllPairsCached from './getAllPairsCached';

const resMap: Record<string, Resolution> = {
  5: '5m',
  15: '15m',
  30: '30m',
  60: '1h',
};

const config: DatafeedConfiguration = {
  // Represents the resolutions for bars supported by your datafeed
  // '5m' | '15m' | '30m' | '1h'
  supported_resolutions: Object.keys(resMap) as ResolutionString[],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [{ value: 'Binance', name: 'Binance', desc: 'Binance' }],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: [{ name: 'crypto', value: 'crypto' }],
};

const DataFeed = {
  onReady: async callback => {
    await getAllPairsCached();
    callback(config);
  },
  searchSymbols: async (userInput, exchange, symbolType, onResult) => {
    const pairs = await getAllPairsCached();
    const matchedPairs = pairs
      .filter(x => x.name.toLowerCase().includes(userInput.toLowerCase()))
      .map(c => ({
        ticker: c.name,
        symbol: c.base.name,
        full_name: c.name,
        description: c.display_name,
        exchange: 'Binance',
        type: 'crypto',
        logo_urls: [cdnCoinIcon(c.base.name.toLowerCase())] as [string],
        // exchange_logo: c,
      }));
    onResult(matchedPairs);
  },
  resolveSymbol: async (symbolName, onResolve, onError) => {
    const pairs = await getAllPairsCached();
    const pair = pairs.find(
      x => x.name === symbolName || x.base.name === symbolName,
    );
    if (!pair) {
      onError('Not found');
      return;
    }

    const symbolInfo = {
      ticker: symbolName,
      name: pair.name,
      description: pair.display_name,
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
      visible_plots_set: 'ohlc',
      has_weekly_and_monthly: false,
      supported_resolutions: config.supported_resolutions,
      data_status: 'streaming',
      logo_urls: [cdnCoinIcon(pair.base.name.toLowerCase())] as [string],
    } satisfies LibrarySymbolInfo;
    onResolve(symbolInfo);
  },
  getBars: async (symbolInfo, resolution, periodParams, onResult, onError) => {
    if (!resMap[resolution]) return onError('Unsupported');

    try {
      const data = await getCandlesCached({
        asset: symbolInfo.name,
        resolution: resMap[resolution],
        startDateTime: new Date(periodParams.from * 1000).toISOString(),
        endDateTime: new Date(periodParams.to * 1000).toISOString(),
        market: 'FUTURES',
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
} satisfies IBasicDataFeed;

export default DataFeed;

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}
