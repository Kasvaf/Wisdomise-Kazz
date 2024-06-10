import {
  type UTCTimestamp,
  createChart,
  LineStyle,
  type LineWidth,
  type ISeriesApi,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { type Candle } from 'api';
import { type SignalFormState } from './AdvancedSignalForm/useSignalFormStates';

const addPriceLines = ({
  series,
  items,
  prefix,
}: {
  series: ISeriesApi<'Candlestick', any>;
  items: Array<{ price: number; color: string }>;
  prefix: string;
}) => {
  for (const [i, { price, color }] of items.entries()) {
    if (!Number.isNaN(price)) {
      series.createPriceLine({
        title: prefix + ' #' + String(i + 1),
        price,
        color,
        lineWidth: 2 as LineWidth,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
      });
    }
  }
};

const TradingViewChart: React.FC<{
  loading?: boolean;
  candles?: Candle[];
  formState: SignalFormState;
}> = ({ candles, formState }) => {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) return;
    const chart = createChart(el.current, {
      height: 450,
      layout: {
        textColor: '#fff',
        background: { color: 'rgba(0,0,0,0.3)' },
      },
      grid: {
        horzLines: {
          color: '#333',
        },
        vertLines: {
          color: '#333',
        },
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      priceLineColor: '#333',
    });

    if (candles?.length) {
      candleSeries?.setData(
        candles
          .map(c => ({
            low: c.low,
            high: c.high,
            open: c.open,
            close: c.close,
            time: roundDate(c.related_at),
          }))
          .sort((a, b) => a.time - b.time),
      );
      chart.timeScale().setVisibleLogicalRange({
        from: candles.length - 200,
        to: candles.length,
      });
    }

    addPriceLines({
      series: candleSeries,
      items: [
        {
          price: Number(+formState.price[0]),
          color: '#fff',
        },
      ],
      prefix: 'Open',
    });

    addPriceLines({
      series: candleSeries,
      items: formState.takeProfits[0].map(x => ({
        price: Number(+x.priceExact),
        color: x.applied ? '#095538' : '#11C37E',
      })),
      prefix: 'TP',
    });

    addPriceLines({
      series: candleSeries,
      items: formState.stopLosses[0].map(x => ({
        price: Number(+x.priceExact),
        color: x.applied ? '#7e1b27' : '#F14056',
      })),
      prefix: 'SL',
    });

    const handleResize = () => {
      chart.applyOptions({ width: el.current?.clientWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candles, formState.price, formState.stopLosses, formState.takeProfits]);

  return <div ref={el} className="overflow-hidden rounded-xl" />;
};

const roundDate = (dateString: string | Date) => {
  const dateMs = +new Date(dateString);
  const dur = 1000 * 60 * 60;
  const roundedDate = new Date(Math.round(dateMs / dur) * dur);
  return +roundedDate as UTCTimestamp;
};

export default TradingViewChart;
