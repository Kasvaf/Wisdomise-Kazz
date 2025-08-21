import { useTraderAssetActivity, useTraderSwapsQuery } from 'api';
import { makeLine } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/useSyncChartLines';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/useUnifiedCoinDetails';
import { useEffect, useMemo, useRef } from 'react';
import { useAdvancedChartWidget } from 'shared/AdvancedChart/ChartWidgetProvider';

interface LineOptions {
  price: number;
  title?: string;
  color?: string;
  id?: string;
}

interface IconOptions {
  time: number; // unix timestamp (seconds)
  price: number;
  text?: string;
  color?: string;
  shape?: 'arrow_up' | 'arrow_down';
}

export function useSwapActivityLines(slug: string) {
  const { data } = useTraderAssetActivity(slug);
  const { data: coin } = useUnifiedCoinDetails({ slug });
  const { data: swaps } = useTraderSwapsQuery({});

  const supply = coin?.marketData.total_supply ?? 0;
  const isMarketCap = localStorage.getItem('tv-market-cap') !== 'false';
  const convertToUsd = localStorage.getItem('tv-convert-to-usd') === 'true';

  const avgBuy = data?.avg_buy_price
    ? Number(data?.avg_buy_price) * (isMarketCap ? supply : 1)
    : undefined;
  const avgSell = data?.avg_sell_price
    ? Number(data?.avg_sell_price) * (isMarketCap ? supply : 1)
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

  const icons =
    swaps?.results
      .filter(s => s.base_slug === slug)
      .map(s => {
        const fromTo = Number(s.from_amount) / Number(s.to_amount);
        const price = s.side === 'LONG' ? fromTo : 1 / fromTo;

        const usdFromTo = Number(s.trading_volume) / Number(s.to_amount);
        const usdPrice = s.side === 'LONG' ? usdFromTo : 1 / usdFromTo;

        return {
          time: Math.floor(new Date(s.created_at).getTime() / 1000),
          price: (convertToUsd ? usdPrice : price) * (isMarketCap ? supply : 1),
          text: s.side === 'LONG' ? 'B' : 'S',
          color: s.side === 'LONG' ? '#0eb396' : '#e63866',
          shape: 'arrow_up',
        } as IconOptions;
      }) ?? [];

  useChartAnnotations(lines, icons);
}

export function useChartAnnotations(
  lines: LineOptions[],
  icons: IconOptions[],
) {
  const [widget] = useAdvancedChartWidget();
  const objectsRef = useRef<any[]>([]);

  function cleanLines() {
    for (const obj of objectsRef.current) obj.remove?.();
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
        // cleanup old
        for (const obj of objectsRef.current) obj.remove?.();
        objectsRef.current = [];

        // add lines
        for (const line of lines) {
          const l = makeLine({
            chart: widget.activeChart(),
            textColor: '',
            title: line.title ?? '',
            price: line.price,
            bgColor: line.color ?? 'green',
          });
          objectsRef.current.push(l);
        }

        // add icons (using shape marks)
        for (const icon of icons) {
          const m = chart.createShape(
            { time: icon.time, price: icon.price },
            {
              shape: icon.shape ?? 'arrow_up',
              text: icon.text,
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
