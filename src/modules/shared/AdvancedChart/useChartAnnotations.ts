import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useEffect, useMemo, useRef } from 'react';
import {
  useHasFlag,
  useTraderAssetQuery,
  useTraderSwapsQuery,
} from 'services/rest';
import { useAdvancedChartWidget } from 'shared/AdvancedChart/ChartWidgetProvider';
import {
  useChartConvertToUSD,
  useChartIsMarketCap,
} from 'shared/AdvancedChart/chartSettings';
import { formatNumber } from 'utils/numbers';
import type { Mark } from '../../../../public/charting_library';

interface LineOptions {
  price: number;
  title?: string;
  color?: string;
  id?: string;
}

interface IconOptions {
  time: number;
  price: number;
  text?: string;
  color?: string;
  shape?: 'arrow_up' | 'arrow_down';
}

export function useSwapActivityLines(slug: string) {
  const { data } = useTraderAssetQuery({ slug });
  const details = useUnifiedCoinDetails();
  const hasFlag = useHasFlag();

  const supply = details?.marketData.totalSupply ?? 0;
  const isMarketCap = localStorage.getItem('tv-market-cap') !== 'false';
  const convertToUsd = localStorage.getItem('tv-convert-to-usd') === 'true';

  const avgBuy = data?.avg_buy_price
    ? Number(convertToUsd ? data?.avg_buy_price_usd : data?.avg_buy_price) *
      (isMarketCap ? supply : 1)
    : undefined;
  const avgSell = data?.avg_sell_price
    ? Number(convertToUsd ? data?.avg_sell_price_usd : data?.avg_sell_price) *
      (isMarketCap ? supply : 1)
    : undefined;

  const lines = useMemo(() => {
    return [
      ...(avgBuy
        ? [
            {
              price: avgBuy,
              color: '#427a2e',
              title: 'Current Average Buy Basis',
            },
          ]
        : []),
      ...(avgSell
        ? [
            {
              price: avgSell,
              color: '#aa5139',
              title: 'Current Average Sell Price',
            },
          ]
        : []),
    ];
  }, [avgBuy, avgSell]);

  useChartAnnotations(hasFlag('/swap-activity') ? lines : [], []);
}

export function useSwapChartMarks(slug: string) {
  const details = useUnifiedCoinDetails();
  const { data: swaps } = useTraderSwapsQuery({ baseSlug: slug });
  const hasFlag = useHasFlag();
  const [isMarketCap] = useChartIsMarketCap();
  const [convertToUsd] = useChartConvertToUSD();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <no need for hasFlag dep>
  return useMemo(() => {
    const supply = details?.marketData.totalSupply ?? 0;

    if (!hasFlag('/swap-activity')) return [];

    return (
      swaps?.results
        .filter(
          s =>
            s.base_slug === slug &&
            s.status !== 'FAILED' &&
            s.status !== 'PENDING',
        )
        .map(s => {
          const fromTo = Number(s.from_amount) / Number(s.to_amount);
          const price = s.side === 'LONG' ? fromTo : 1 / fromTo;

          const usdFromTo = Number(s.trading_volume) / Number(s.to_amount);
          const usdPrice = s.side === 'LONG' ? usdFromTo : 1 / usdFromTo;

          const priceOrMc =
            (convertToUsd ? usdPrice : price) * (isMarketCap ? supply : 1);
          const formatedPriceOrMc = formatNumber(priceOrMc, {
            decimalLength: 3,
            minifyDecimalRepeats: !isMarketCap,
            compactInteger: isMarketCap,
            separateByComma: false,
            exactDecimal: isMarketCap,
          });
          const formatedVolume = formatNumber(Number(s.trading_volume ?? '0'), {
            decimalLength: 3,
            minifyDecimalRepeats: false,
            compactInteger: false,
            separateByComma: false,
          });
          const text = `You ${s.side === 'LONG' ? 'bought' : 'sold'} $${formatedVolume} at ${formatedPriceOrMc} ${convertToUsd ? 'USD' : 'SOL'} ${isMarketCap ? 'Market Cap' : ''}`;

          return {
            id: s.created_at,
            label: s.side === 'LONG' ? 'B' : 'S',
            labelFontColor: 'white',
            minSize: 30,
            time: Math.floor(new Date(s.created_at).getTime() / 1000),
            price: priceOrMc,
            text: s.status === 'PENDING' ? undefined : text,
            color: s.side === 'LONG' ? 'green' : 'red',
          } as Mark;
        }) ?? []
    );
  }, [swaps, slug, details?.marketData.totalSupply, isMarketCap, convertToUsd]);
}

export function useChartAnnotations(
  lines: LineOptions[],
  icons: IconOptions[],
) {
  const [widget] = useAdvancedChartWidget();
  const objectsRef = useRef<any[]>([]);

  function cleanLines() {
    for (const obj of objectsRef.current) {
      try {
        widget?.activeChart().removeEntity(obj);
      } catch {}
    }
    objectsRef.current = [];
  }

  // this is very necessary to prevent read-calls (race-condition) after use-effect destructed
  let destructed = false;
  function getChartCleaned() {
    try {
      cleanLines();
      return !destructed && widget?.activeChart();
    } catch {}
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (!widget) return;

    widget.onChartReady(() => {
      const chart = getChartCleaned();
      if (!chart) return;

      chart.dataReady(() => {
        // add lines
        for (const line of lines) {
          const l = chart.createShape(
            { time: Date.now() / 1000, price: line.price },
            {
              shape: 'horizontal_line',
              text: line.title,
              overrides: {
                linecolor: line.color,
                textcolor: line.color,
                linestyle: 2, // 0=solid, 1=dotted, 2=dashed
                linewidth: 2,
                showLabel: true,
                horzLabelsAlign: 'right', // left | center | right
                vertLabelsAlign: 'bottom', // top | middle | bottom
              },
              disableSelection: true,
              disableSave: true,
              lock: true,
            },
          );
          objectsRef.current.push(l);
        }

        // add icons (using shape marks)
        for (const icon of icons) {
          const m = chart.createShape(
            { time: icon.time, price: icon.price, channel: 'low' },
            {
              shape: 'emoji',
              icon: 0xf0_04,
              lock: true,
              disableSelection: true,
            },
          );
          objectsRef.current.push(m);
        }
      });
    });

    return () => {
      destructed = true;
      cleanLines();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widget, JSON.stringify(icons), JSON.stringify(lines)]);
}
