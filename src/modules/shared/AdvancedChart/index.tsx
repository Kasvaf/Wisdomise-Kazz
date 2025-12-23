import { clsx } from 'clsx';
import { RouterBaseName } from 'config/constants';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useTotalSupply } from 'modules/discovery/DetailView/CoinDetail/useTotalSupply';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { useTokenPairsQuery } from 'services/rest';
import { useTokenInfo } from 'services/rest/token-info';
import { useChartMarks } from 'shared/AdvancedChart/Marks/useChartMarks';
import { useKnownWallets } from 'shared/AdvancedChart/useKnownWallets';
import { formatNumber } from 'utils/numbers';
import {
  type IChartingLibraryWidget,
  type LanguageCode,
  type ResolutionString,
  type Timezone,
  widget as Widget,
} from '../../../../public/charting_library';
import { useAdvancedChartWidget } from './ChartWidgetProvider';
import { useChartConvertToUSD, useChartIsMarketCap } from './chartSettings';
import { LocalStorageSaveLoadAdapter } from './localStorageSaveLoadAdapter';
import makeDataFeed from './makeDataFeed';
import { useSwapActivityLines } from './useChartAnnotations';

const AdvancedChart: React.FC<{
  widgetRef?: (ref: IChartingLibraryWidget | undefined) => void;
  className?: string;
}> = ({ widgetRef, className }) => {
  const details = useUnifiedCoinDetails();
  const slug = details.symbol.slug;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  useSwapActivityLines(slug);

  const {
    i18n: { language },
  } = useTranslation();

  const [, setGlobalChartWidget] = useAdvancedChartWidget();
  const [convertToUsd, setConvertToUsd] = useChartConvertToUSD();
  const [isMarketCap, setIsMarketCap] = useChartIsMarketCap();
  const { marksRef, addSwap, setMigratedAt } = useChartMarks();
  const { totalSupply } = useTotalSupply();
  const knownWallets = useKnownWallets();
  const knownWalletsRef = useRef(knownWallets);
  const { data: tokenInfo } = useTokenInfo({ slug });

  useEffect(() => {
    knownWalletsRef.current = knownWallets || [];
  }, [knownWallets]);

  const [quote, setQuote] = useActiveQuote();
  const { data: pairs } = useTokenPairsQuery(slug);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (!totalSupply || !pairs?.length) return;

    const initResolution = (localStorage.getItem(
      'tradingview.chart.lastUsedTimeBasedResolution',
    ) || '1s') as ResolutionString;
    // const pair = pairs.find(x => x.quote.slug === quote);
    // if (!pair) return;

    const widget = new Widget({
      symbol: tokenInfo?.name ?? undefined,
      datafeed: makeDataFeed({
        quote,
        slug,
        network: 'solana',
        isMarketCap,
        totalSupply,
        marksRef,
        addSwap,
        setMigratedAt,
        walletsRef: knownWalletsRef,
      }),
      // datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
      //   'https://demo-feed-data.tradingview.com',
      // ),
      container: chartContainerRef.current as HTMLElement,
      library_path: `${RouterBaseName ? `/${RouterBaseName}` : ''}/charting_library/`,
      custom_css_url: `${RouterBaseName ? `/${RouterBaseName}` : ''}/charting_library/custom.css`,

      locale: language as LanguageCode,
      enabled_features: [
        'seconds_resolution',
        'use_localstorage_for_settings',
        'two_character_bar_marks_labels',
      ],
      disabled_features: [
        'symbol_search_hot_key',
        'hide_price_scale_global_last_bar_value',
        'chart_style_hilo_last_price',
        'header_symbol_search',
        'right_toolbar',
        'header_compare',
        'save_chart_properties_to_local_storage',
      ],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
      interval: initResolution,
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

      save_load_adapter: new LocalStorageSaveLoadAdapter(),
      load_last_chart: true,
      auto_save_delay: 1,
    });

    widget.onChartReady(async () => {
      await widget.headerReady();

      widget.subscribe('onAutoSaveNeeded', () => {
        widget.saveChartToServer(undefined, undefined, { chartName: 'GoatX' });
      });

      // Create quote selector
      if (pairs.length > 1) {
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
                  setQuote(x.quote.slug);
                  dropDown.applyOptions({
                    title:
                      pairs?.find(y => y.quote.slug === x.quote.slug)?.quote
                        .abbreviation ?? '',
                  });
                },
              })) ?? [],
          title:
            pairs?.find(x => x.quote.slug === quote)?.quote.abbreviation ?? '',
        });
      }

      if (quote === WRAPPED_SOLANA_SLUG) {
        const convertToUsdButton = widget.createButton();
        function setConvertButtonInnerContent() {
          const colorStyle = 'style="color:#beff21"';
          convertToUsdButton.innerHTML = `<span ${convertToUsd ? colorStyle : ''}>USD</span>/<span ${
            convertToUsd ? '' : colorStyle
          }>${
            pairs?.find(x => x.quote.slug === quote)?.quote.abbreviation ?? ''
          }</span>`;
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
        widget.activeChart().refreshMarks();
        // setIsMarketCap(!isMarketCap);
        // setButtonInnerContent();
        // widget.activeChart().resetData();
      });
    });

    widgetRef?.(widget);
    setGlobalChartWidget?.(widget);

    return () => {
      setGlobalChartWidget?.(undefined);
      widget.remove();
    };
  }, [
    language,
    setGlobalChartWidget,
    widgetRef,
    totalSupply,
    quote,
    slug,
    pairs,
    convertToUsd,
    isMarketCap,
    setIsMarketCap,
    setQuote,
    setConvertToUsd,
    tokenInfo,
  ]);

  return <div className={clsx(className)} ref={chartContainerRef} />;
};

export default AdvancedChart;
