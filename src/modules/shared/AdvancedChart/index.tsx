import { clsx } from 'clsx';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';
import { RouterBaseName } from 'config/constants';
import { useGrpcService } from 'api/grpc-utils';
import { formatNumber } from 'utils/numbers';
import { useSupportedPairs } from 'api';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/useUnifiedCoinDetails';
import { useAverageBuySellLines } from 'shared/AdvancedChart/useChartAnnotations';
import { useAdvancedChartWidget } from 'shared/AdvancedChart/ChartWidgetProvider';
import { type Timezone } from '../../../../public/charting_library';
import {
  widget as Widget,
  type IChartingLibraryWidget,
  type ResolutionString,
} from './charting_library';
import makeDataFeed from './makeDataFeed';
import useCoinPoolInfo from './useCoinPoolInfo';

const AdvancedChart: React.FC<{
  slug: string;
  widgetRef?: (ref: IChartingLibraryWidget | undefined) => void;
  className?: string;
}> = ({ slug, widgetRef, className }) => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  useAverageBuySellLines(slug);

  const {
    i18n: { language },
  } = useTranslation();

  const delphinus = useGrpcService('delphinus');

  const [, setGlobalChartWidget] = useAdvancedChartWidget();
  const { data, isLoading } = useCoinPoolInfo(slug);
  const { data: details } = useUnifiedCoinDetails({ slug });
  const [convertToUsd, setConvertToUsd] = useLocalStorage(
    'tv-convert-to-usd',
    false,
  );
  const [isMarketCap, setIsMarketCap] = useLocalStorage('tv-market-cap', true);
  const supply = details?.marketData.total_supply ?? 0;

  const [, setPageQuote] = useActiveQuote();
  const { data: pairs } = useSupportedPairs(slug);

  useEffect(() => {
    if (isLoading || !data?.network) return;
    const savedResolution = (localStorage.getItem(
      'tradingview.chart.lastUsedTimeBasedResolution',
    ) || '30') as ResolutionString;

    const widget = new Widget({
      symbol: data.symbolName,
      datafeed: makeDataFeed(delphinus, { ...data, isMarketCap, supply }),
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
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
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
        'paneProperties.backgroundType': 'solid',
        'paneProperties.background': '#0c0c0c',
      },
      favorites: {
        intervals: ['1S', '1', '5', '15', '60', '240'] as ResolutionString[],
      },
      custom_formatters: {
        priceFormatterFactory: () => {
          return {
            format: price => {
              return formatNumber(price, {
                decimalLength: 3,
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
          const colorStyle = 'style="color:#beff21"';
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
        const colorStyle = 'style="color:#beff21"';
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
