import { clsx } from 'clsx';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { RouterBaseName } from 'config/constants';
import { useGrpcService } from 'api/grpc-utils';
import { compressByLabel, toSignificantDigits } from 'utils/numbers';
import { useCoinDetails } from 'api/discovery';
import {
  type TimeFrameType,
  widget as Widget,
  type IChartingLibraryWidget,
  type ResolutionString,
} from './charting_library';
import makeDataFeed from './makeDataFeed';
import useCoinPoolInfo from './useCoinPoolInfo';

type OptionalChart = IChartingLibraryWidget | undefined;
const ChartContext = createContext<
  [OptionalChart, Dispatch<SetStateAction<OptionalChart>>] | undefined
>(undefined);

export const ChartWidgetProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const chartState = useState<OptionalChart>();
  return (
    <ChartContext.Provider value={chartState}>{children}</ChartContext.Provider>
  );
};

export const useAdvancedChartWidget = () => {
  const [chartWidget] = useContext(ChartContext) ?? [];
  return chartWidget;
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

  const delphinus = useGrpcService('delphinus');

  const [, setGlobalChartWidget] = useContext(ChartContext) ?? [];
  const { data, isLoading } = useCoinPoolInfo(slug);
  const { data: details } = useCoinDetails({ slug });
  const supply = details?.data?.total_supply ?? 1;

  useEffect(() => {
    if (isLoading || !data?.network) return;
    let isMarketCap = localStorage.getItem('tw-market-cap') !== 'false';
    let savedResolution = (localStorage.getItem('chart-resolution') ||
      '30') as ResolutionString;

    const widget = new Widget({
      symbol: data.symbolName,
      datafeed: makeDataFeed(delphinus, data),
      container: chartContainerRef.current,
      library_path:
        (RouterBaseName ? '/' + RouterBaseName : '') + '/charting_library/',

      locale: language as any,
      // enabled_features: ['study_templates'],
      disabled_features: [
        // 'use_localstorage_for_settings',
        'symbol_search_hot_key',
        'hide_price_scale_global_last_bar_value',
        'chart_style_hilo_last_price',
        'header_symbol_search',
        // 'left_toolbar',
        'right_toolbar',
        'header_compare',
        // 'header_resolutions',
      ],
      enabled_features: ['seconds_resolution', 'use_localstorage_for_settings'],
      timeframe: '7D', // initial zoom on chart
      interval: savedResolution,
      time_frames: [
        { title: '3m', text: '3m', resolution: '60' as ResolutionString },
        { title: '1m', text: '1m', resolution: '30' as ResolutionString },
        { title: '5d', text: '5D', resolution: '5' as ResolutionString },
        { title: '1d', text: '1D', resolution: '1' as ResolutionString },
      ],
      overrides: {
        'scalesProperties.showSymbolLabels': false,
        'scalesProperties.showSeriesLastValue': false,
        'scalesProperties.showSeriesPrevCloseValue': false,
        'scalesProperties.seriesLastValueMode': 1,
        'mainSeriesProperties.showPriceLine': false,
        'paneProperties.showSymbolLabels': false,
      },
      favorites: {
        intervals: ['1S', '1', '5', '15', '60', '240'] as ResolutionString[],
      },
      custom_formatters: {
        priceFormatterFactory: symbolInfo => {
          const seenVals: number[] = [];

          if (symbolInfo && symbolInfo.format === 'volume') {
            return {
              format: price => {
                // use running average to detect zero value!
                const val = price * (isMarketCap ? supply : 1);
                const avg = seenVals.reduce((a, b) => a + b, 0) / 10;
                seenVals.unshift(val);
                seenVals.length = 10;
                if (Math.abs(val) < avg / 1e6) return '0';

                const { value, label } = compressByLabel(val);
                return String(toSignificantDigits(+value, 3)) + label;
              },
            };
          }
          return null; // default formatter
        },
      },

      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      theme: 'dark',
    });

    widget.onChartReady(async () => {
      widget
        .activeChart()
        .onIntervalChanged()
        .subscribe(null, async (interval, timeframeObj) => {
          // Persist chart resolution
          if (interval !== savedResolution) {
            localStorage.setItem('chart-resolution', interval);
            savedResolution = interval;
          }

          const now = Math.floor(Date.now() / 1000);
          const res =
            Number.parseInt(interval) * (interval.endsWith('S') ? 1 : 60);
          const from = now - res * 700;
          timeframeObj.timeframe = {
            from,
            to: now,
            type: 'time-range' as TimeFrameType.TimeRange,
          };

          widget.activeChart().executeActionById('chartReset');
        });

      // Create button for MarketCap/Price toggle in top toolbar
      await widget.headerReady();
      const button = widget.createButton();
      function setButtonInnerContent() {
        const colorStyle = 'style="color:#00a3ff"';
        button.innerHTML = `<span ${
          isMarketCap ? colorStyle : ''
        }>MarketCap</span>/<span ${isMarketCap ? '' : colorStyle}>Price</span>`;
      }
      setButtonInnerContent();
      button.addEventListener('click', () => {
        isMarketCap = !isMarketCap;
        localStorage.setItem('tw-market-cap', String(isMarketCap));
        setButtonInnerContent();
        widget.activeChart().resetData();
      });
    });

    widgetRef?.(widget);
    setGlobalChartWidget?.(widget);

    return () => {
      setGlobalChartWidget?.(undefined);
      widget.remove();
    };
  }, [
    slug,
    data,
    isLoading,
    language,
    setGlobalChartWidget,
    widgetRef,
    delphinus,
    supply,
  ]);

  if (isLoading || !data?.network) return null;
  return (
    <div ref={chartContainerRef} className={clsx('h-[600px]', className)} />
  );
};

export default AdvancedChart;
