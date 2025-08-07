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
import { useLocalStorage } from 'usehooks-ts';
import { RouterBaseName } from 'config/constants';
import { useGrpcService } from 'api/grpc-utils';
import { formatNumber } from 'utils/numbers';
import { useSupportedPairs } from 'api';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/useUnifiedCoinDetails';
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
  const { data: details } = useUnifiedCoinDetails({ slug });
  const [convertToUsd, setConvertToUsd] = useLocalStorage(
    'tv-convert-to-usd',
    false,
  );
  const [isMarketCap, setIsMarketCap] = useLocalStorage('tv-market-cap', true);
  const supply = details?.marketData.total_supply ?? 0;
  console.log('totalSupply', supply);

  const [, setPageQuote] = useActiveQuote();
  const { data: pairs } = useSupportedPairs(slug);

  useEffect(() => {
    if (isLoading || !data?.network) return;
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
      favorites: {
        intervals: ['1S', '1', '5', '15', '60', '240'] as ResolutionString[],
      },
      custom_formatters: {
        priceFormatterFactory: () => {
          return {
            format: price => {
              let val = price * (isMarketCap ? supply : 1);
              val = isMarketCap ? Number(val.toFixed(0)) : val;

              return formatNumber(val, {
                decimalLength: isMarketCap ? 1 : 3,
                minifyDecimalRepeats: !isMarketCap,
                compactInteger: isMarketCap,
                separateByComma: false,
                exactDecimal: isMarketCap,
              });
            },
          };
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

      await widget.headerReady();

      // Create quote selector
      const dropDown = await widget.createDropdown({
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="8" height="8" style="padding-right: 4px"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"></path></svg>',
        tooltip: 'Quote',
        items:
          pairs
            ?.filter(
              (x): x is typeof x & { quote: { abbreviation: string } } =>
                !!x.quote.abbreviation,
            )
            ?.map(x => ({
              title: x.quote.abbreviation,
              onSelect: () => {
                setPageQuote(x.quote.slug);
                dropDown.applyOptions({
                  title:
                    pairs?.find(y => y.quote.slug === x.quote.slug)?.quote
                      .abbreviation ?? '',
                });
              },
            })) ?? [],
        title:
          pairs?.find(x => x.quote.slug === data.quote)?.quote.abbreviation ??
          '',
      });

      if (data.quote !== 'tether' && data.quote !== 'usd-coin') {
        const convertToUsdButton = widget.createButton();
        function setConvertButtonInnerContent() {
          const colorStyle = 'style="color:#00a3ff"';
          convertToUsdButton.innerHTML = `<span ${
            convertToUsd ? '' : colorStyle
          }>${
            pairs?.find(x => x.quote.slug === data?.quote)?.quote
              .abbreviation ?? ''
          }</span>/<span ${convertToUsd ? colorStyle : ''}>USD</span>`;
        }
        setConvertButtonInnerContent();
        convertToUsdButton.addEventListener('click', () => {
          setConvertToUsd(!convertToUsd);
          setConvertButtonInnerContent();
          widget.activeChart().resetData();
        });
      }

      // Create button for MarketCap/Price toggle in top toolbar
      const button = widget.createButton();
      function setButtonInnerContent() {
        const colorStyle = 'style="color:#00a3ff"';
        button.innerHTML = `<span ${
          isMarketCap ? colorStyle : ''
        }>MarketCap</span>/<span ${isMarketCap ? '' : colorStyle}>Price</span>`;
      }
      setButtonInnerContent();
      button.addEventListener('click', () => {
        setIsMarketCap(!isMarketCap);
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
    pairs,
    convertToUsd,
    isMarketCap,
    setIsMarketCap,
    setPageQuote,
    setConvertToUsd,
  ]);

  if (isLoading || !data?.network) return null;
  return <div ref={chartContainerRef} className={clsx(className)} />;
};

export default AdvancedChart;
