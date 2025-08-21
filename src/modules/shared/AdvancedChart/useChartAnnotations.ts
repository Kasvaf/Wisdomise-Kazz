import { useTraderAssetActivity } from 'api';
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

export function useAverageBuySellLines(slug: string) {
  const { data } = useTraderAssetActivity(slug);
  const { data: coin } = useUnifiedCoinDetails({ slug });

  const supply = coin?.marketData.total_supply ?? 0;
  const isMarketCap = localStorage.getItem('tv-market-cap') !== 'false';
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

  useChartAnnotations(lines, []);
}

export function useChartAnnotations(
  lines: LineOptions[],
  icons: IconOptions[],
) {
  const [widget] = useAdvancedChartWidget();
  const objectsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!widget) return;

    widget.onChartReady(() => {
      const chart = widget.activeChart();
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
      // cleanup on unmount
      for (const obj of objectsRef.current) obj.remove?.();
      objectsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widget, icons, lines]);
}
