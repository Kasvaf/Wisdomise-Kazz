import { clsx } from 'clsx';
import { RouterBaseName } from 'config/constants';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useTotalSupply } from 'modules/discovery/DetailView/CoinDetail/useTotalSupply';
import { useEffect, useRef, useState } from 'react';
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
import {
  getChartOverrides,
  getDisabledFeatures,
  getEnabledFeatures,
} from './chartConfig';
import { useChartConvertToUSD, useChartIsMarketCap } from './chartSettings';
import { LocalStorageSaveLoadAdapter } from './localStorageSaveLoadAdapter';
import makeDataFeed from './makeDataFeed';
import { useSwapActivityLines } from './useChartAnnotations';
import { getDeviceType } from './utils';

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
  const { marksRef, addSwap, setMigratedAt, content } = useChartMarks();
  const { totalSupply } = useTotalSupply();
  const knownWallets = useKnownWallets();
  const knownWalletsRef = useRef(knownWallets);
  const { data: tokenInfo } = useTokenInfo({ slug });

  // Get symbol name/abbreviation from unified details
  const symbolName =
    details.symbol.abbreviation ||
    details.symbol.name ||
    tokenInfo?.symbol ||
    tokenInfo?.name;

  useEffect(() => {
    knownWalletsRef.current = knownWallets || [];
  }, [knownWallets]);

  const [quote, setQuote] = useActiveQuote();
  const { data: pairs } = useTokenPairsQuery(slug);

  // Detect device type for responsive configuration
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(
    () => getDeviceType(),
  );

  // Update device type on window resize
  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (!totalSupply || !pairs?.length) return;

    const initResolution = (localStorage.getItem(
      'tradingview.chart.lastUsedTimeBasedResolution',
    ) || '1s') as ResolutionString;
    // const pair = pairs.find(x => x.quote.slug === quote);
    // if (!pair) return;

    let isDestroyed = false;

    // Get device-specific configurations
    const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
    const enabledFeatures = getEnabledFeatures(deviceType);
    const disabledFeatures = getDisabledFeatures(deviceType);
    const chartOverrides = getChartOverrides(deviceType);

    const widget = new Widget({
      symbol: symbolName || slug,
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
        convertToUsd,
      }),
      // datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
      //   'https://demo-feed-data.tradingview.com',
      // ),
      container: chartContainerRef.current as HTMLElement,
      library_path: `${RouterBaseName ? `/${RouterBaseName}` : ''}/charting_library/`,
      custom_css_url: `${RouterBaseName ? `/${RouterBaseName}` : ''}/charting_library/custom.css`,

      locale: language as LanguageCode,

      // Use device-specific feature sets
      enabled_features: enabledFeatures,
      disabled_features: disabledFeatures,

      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
      interval: initResolution,
      time_frames: [
        { title: '3m', text: '3m', resolution: '60' as ResolutionString },
        { title: '1m', text: '1m', resolution: '30' as ResolutionString },
        { title: '5d', text: '5D', resolution: '5' as ResolutionString },
        { title: '1d', text: '1D', resolution: '1' as ResolutionString },
      ],

      // Use device-specific overrides
      overrides: chartOverrides,

      favorites: {
        intervals: [
          '1S',
          '5S',
          '15S',
          '30S',
          '1',
          '3',
          '5',
          '15',
          '30',
          '60',
          '240',
        ] as ResolutionString[],
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
      // Disable loading saved chart state on mobile to ensure default zoom applies
      load_last_chart: !isMobile,
      auto_save_delay: 1,
    });

    widget.onChartReady(async () => {
      if (isDestroyed) return;

      await widget.headerReady();

      if (isDestroyed) return;

      // Set initial zoom level to show more historical data on mobile
      if (isMobile) {
        try {
          const chart = widget.activeChart();
          // Get current time in seconds
          const now = Math.floor(Date.now() / 1000);
          // Show last 6 hours of data by default (well spread out)
          // This gives a good overview with visible candle spacing
          const timeRange = 21_600; // 6 hours in seconds

          // Apply the visible range immediately since we're not loading saved state
          chart.setVisibleRange(
            {
              from: now - timeRange,
              to: now,
            },
            () => {
              // Optional callback after range is set
            },
          );
        } catch (error) {
          console.warn('Could not set initial visible range:', error);
        }
      }

      widget.subscribe('onAutoSaveNeeded', () => {
        if (isDestroyed) return;
        widget.saveChartToServer(undefined, undefined, { chartName: 'GoatX' });
      });

      // Create timeframe selector dropdown (optimized for mobile)
      if (!isDestroyed) {
        const timeframes: Array<{
          resolution: ResolutionString;
          label: string;
        }> = [
          { resolution: '1S' as ResolutionString, label: '1s' },
          { resolution: '5S' as ResolutionString, label: '5s' },
          { resolution: '15S' as ResolutionString, label: '15s' },
          { resolution: '30S' as ResolutionString, label: '30s' },
          { resolution: '1' as ResolutionString, label: '1m' },
          { resolution: '3' as ResolutionString, label: '3m' },
          { resolution: '5' as ResolutionString, label: '5m' },
          { resolution: '15' as ResolutionString, label: '15m' },
          { resolution: '30' as ResolutionString, label: '30m' },
          { resolution: '60' as ResolutionString, label: '1h' },
          { resolution: '240' as ResolutionString, label: '4h' },
        ];

        const getTimeframeLabel = (resolution: ResolutionString) => {
          const tf = timeframes.find(t => t.resolution === resolution);
          return tf?.label || resolution;
        };

        const currentInterval = widget.activeChart().resolution();

        // Mobile-optimized dropdown with larger touch targets
        const dropdownIcon = isMobile
          ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="10" height="10" style="padding-right: 4px"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"></path></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="8" height="8" style="padding-right: 4px"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"></path></svg>';

        const timeframeDropdown = await widget.createDropdown({
          icon: dropdownIcon,
          tooltip: 'Timeframe',
          items: timeframes.map(tf => ({
            title: tf.label,
            onSelect: () => {
              if (isDestroyed) return;
              widget.activeChart().setResolution(tf.resolution, () => {
                if (!isDestroyed) {
                  timeframeDropdown.applyOptions({
                    title: tf.label,
                  });
                }
              });
            },
          })),
          title: getTimeframeLabel(currentInterval),
        });

        // Listen for resolution changes and update dropdown
        widget
          .activeChart()
          .onIntervalChanged()
          .subscribe(null, interval => {
            if (isDestroyed) return;
            timeframeDropdown.applyOptions({
              title: getTimeframeLabel(interval as ResolutionString),
            });
          });
      }

      // Create quote selector
      if (pairs.length > 1 && !isDestroyed) {
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

      if (quote === WRAPPED_SOLANA_SLUG && !isDestroyed) {
        const convertToUsdButton = widget.createButton();

        // Mobile-optimized button styling
        if (isMobile) {
          convertToUsdButton.style.padding = '6px 10px';
          convertToUsdButton.style.fontSize = '13px';
          convertToUsdButton.style.minHeight = '32px';
        }

        function setConvertButtonInnerContent() {
          const colorStyle = 'style="color:#beff21;font-weight:500"';
          const inactiveStyle = isMobile ? 'style="opacity:0.7"' : '';
          convertToUsdButton.innerHTML = `<span ${convertToUsd ? colorStyle : inactiveStyle}>USD</span>/<span ${
            convertToUsd ? inactiveStyle : colorStyle
          }>${
            pairs?.find(x => x.quote.slug === quote)?.quote.abbreviation ?? ''
          }</span>`;
        }
        setConvertButtonInnerContent();
        convertToUsdButton.addEventListener('click', () => {
          if (isDestroyed) return;
          setConvertToUsd(!convertToUsd);
          setConvertButtonInnerContent();
          widget.activeChart().resetData();
        });
      }

      if (isDestroyed) return;

      // Create button for MarketCap/Price toggle in top toolbar
      const button = widget.createButton();

      // Mobile-optimized button styling
      if (isMobile) {
        button.style.padding = '6px 10px';
        button.style.fontSize = '13px';
        button.style.minHeight = '32px';
      }

      function setButtonInnerContent() {
        const colorStyle = 'style="color:#beff21;font-weight:500"';
        const inactiveStyle = isMobile ? 'style="opacity:0.7"' : '';
        button.innerHTML = `<span ${
          isMarketCap ? colorStyle : inactiveStyle
        }>${isMobile ? 'MCap' : 'MarketCap'}</span>/<span ${isMarketCap ? inactiveStyle : colorStyle}>Price</span>`;
      }
      setButtonInnerContent();
      button.addEventListener('click', () => {
        if (isDestroyed) return;
        widget.activeChart().refreshMarks();
        setIsMarketCap(!isMarketCap);
        setButtonInnerContent();
        widget.activeChart().resetData();
      });
    });

    widgetRef?.(widget);
    setGlobalChartWidget?.(widget);

    return () => {
      isDestroyed = true;
      setGlobalChartWidget?.(undefined);
      try {
        widget.remove();
      } catch (error) {
        // Widget already removed or not fully initialized
        console.warn('Error removing TradingView widget:', error);
      }
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
    symbolName,
    deviceType, // Re-render chart when device type changes
  ]);

  return (
    <>
      <div
        className={clsx(className)}
        ref={chartContainerRef}
        style={{
          minHeight: deviceType === 'mobile' ? '400px' : '500px',
          height: '100%',
          width: '100%',
        }}
      />
      {content}
    </>
  );
};

export default AdvancedChart;
