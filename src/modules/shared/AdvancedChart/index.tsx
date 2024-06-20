import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterBaseName } from 'config/constants';
import {
  widget as Widget,
  type IChartingLibraryWidget,
  type ResolutionString,
} from './charting_library';
import DataFeed from './DataFeed';

const AdvancedChart: React.FC<{
  assetName: string;
  widgetRef: (ref: IChartingLibraryWidget | undefined) => void;
}> = ({ assetName, widgetRef }) => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    const widget = new Widget({
      symbol: assetName,
      datafeed: DataFeed,
      interval: '60' as ResolutionString,
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
      ],
      overrides: {
        'scalesProperties.showSymbolLabels': false,
        'scalesProperties.showSeriesLastValue': false,
        'scalesProperties.showSeriesPrevCloseValue': false,
        'scalesProperties.seriesLastValueMode': 1,
        'mainSeriesProperties.showPriceLine': false,
        'paneProperties.showSymbolLabels': false,
      },
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      theme: 'dark',
    });

    widgetRef(widget);

    return () => widget.remove();
  }, [assetName, language, widgetRef]);

  return <div ref={chartContainerRef} className="h-[600px]" />;
};

export default AdvancedChart;
