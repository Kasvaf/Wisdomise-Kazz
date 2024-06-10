import { type UTCTimestamp, createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { type Candle } from 'api';

const TradingViewChart: React.FC<{
  loading?: boolean;
  candles?: Candle[];
}> = ({ candles }) => {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) return;
    const chart = createChart(el.current, {
      height: 450,
      layout: {
        textColor: '#fff',
        background: { color: 'rgba(0,0,0,0.3)' },
      },
    });

    if (candles?.length) {
      const candleSeries = chart.addCandlestickSeries();
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
      chart.timeScale().fitContent();
    }

    const handleResize = () => {
      chart.applyOptions({ width: el.current?.clientWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candles]);

  return <div ref={el} className="overflow-hidden rounded-xl" />;
};

const roundDate = (dateString: string | Date) => {
  const dateMs = +new Date(dateString);
  const dur = 1000 * 60 * 60;
  const roundedDate = new Date(Math.round(dateMs / dur) * dur);
  return +roundedDate as UTCTimestamp;
};

export default TradingViewChart;
