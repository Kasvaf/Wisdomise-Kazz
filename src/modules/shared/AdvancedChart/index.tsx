import { clsx } from 'clsx';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterBaseName } from 'config/constants';
import { useLastCandleQuery } from 'api';
import { useSymbolInfo } from 'api/symbol';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import {
  widget as Widget,
  type IChartingLibraryWidget,
  type ResolutionString,
} from './charting_library';
import makeDataFeed from './makeDataFeed';

const useCoinPoolInfo = (slug: string) => {
  const [pageQuote] = useSearchParamAsState<string>('quote', 'tether');
  const quote = useDebounce(pageQuote, 1000);
  const lastCandle = useLastCandleQuery({ slug, quote });
  const info = useSymbolInfo(slug);

  const net = info.data?.networks.find(
    x => x.network.slug === lastCandle.data?.symbol.network,
  );

  return useMemo(
    () => ({
      isLoading: lastCandle.isLoading || info.isLoading,
      data:
        net && info.data?.name && lastCandle.data?.symbol.pool_address
          ? {
              slug,
              quote,
              symbolName: info.data.name,
              token: net.contract_address,
              network: net.network.slug,
              pool: lastCandle.data.symbol.pool_address,
            }
          : undefined,
    }),
    [
      net,
      slug,
      quote,
      info.isLoading,
      info.data?.name,
      lastCandle.isLoading,
      lastCandle.data?.symbol.pool_address,
    ],
  );
};

const AdvancedChart: React.FC<{
  slug: string;
  widgetRef?: (ref: IChartingLibraryWidget | undefined) => void;
  className?: string;
}> = ({ slug, widgetRef, className }) => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const {
    i18n: { language },
  } = useTranslation();

  const { data, isLoading } = useCoinPoolInfo(slug);
  useEffect(() => {
    if (isLoading || !data?.pool) return;

    const widget = new Widget({
      symbol: data.symbolName,
      datafeed: makeDataFeed(data),
      container: chartContainerRef.current,
      library_path:
        (RouterBaseName ? '/' + RouterBaseName : '') + '/charting_library/',

      locale: language as any,
      // enabled_features: ['study_templates'],
      disabled_features: [
        'use_localstorage_for_settings',
        'header_symbol_search',
        'symbol_search_hot_key',
        'hide_price_scale_global_last_bar_value',
        'chart_style_hilo_last_price',
        'header_symbol_search',
        // 'left_toolbar',
        'right_toolbar',
        'header_compare',
        // 'header_resolutions',
      ],
      timeframe: '7D', // initial zoom on chart
      interval: '1h' as ResolutionString,
      time_frames: [
        { title: '12h/1m', text: '12h', resolution: '1' as ResolutionString },
        { title: '1d/5m', text: '1D', resolution: '5' as ResolutionString },
        { title: '5d/15m', text: '5D', resolution: '15' as ResolutionString },
        { title: '7d/1h', text: '7D', resolution: '60' as ResolutionString }, // default
        { title: '31d/4h', text: '30D', resolution: '240' as ResolutionString },
        {
          title: '180d/1d',
          text: '180D',
          resolution: '1440' as ResolutionString,
        },
      ],
      overrides: {
        'scalesProperties.showSymbolLabels': false,
        'scalesProperties.showSeriesLastValue': false,
        'scalesProperties.showSeriesPrevCloseValue': false,
        'scalesProperties.seriesLastValueMode': 1,
        'mainSeriesProperties.showPriceLine': false,
        // 'mainSeriesProperties.minTick': '10000,1,false',
        'paneProperties.showSymbolLabels': false,
      },
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      theme: 'dark',
    });

    widgetRef?.(widget);

    return () => widget.remove();
  }, [slug, data, isLoading, language, widgetRef]);

  if (isLoading || !data?.pool) return null;
  return (
    <div ref={chartContainerRef} className={clsx('h-[600px]', className)} />
  );
};

export default AdvancedChart;
