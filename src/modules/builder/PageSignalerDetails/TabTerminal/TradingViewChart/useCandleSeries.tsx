import {
  type IChartApi,
  type UTCTimestamp,
  type ISeriesApi,
} from 'lightweight-charts';
import { useEffect, useState } from 'react';
import { type Candle } from 'api';

const roundDate = (dateString: string | Date) => {
  const dateMs = +new Date(dateString);
  const dur = 1000 * 60 * 60;
  const roundedDate = new Date(Math.round(dateMs / dur) * dur);
  return +roundedDate as UTCTimestamp;
};

const useCandleSeries = ({
  chart,
  candles,
}: {
  chart?: IChartApi;
  candles?: Candle[];
}) => {
  const [candleSeries, setCandleSeries] =
    useState<ISeriesApi<'Candlestick', any>>();

  useEffect(() => {
    if (!chart || !candles) return;

    const lowestRecent = Math.min(...candles.map(x => x.low).slice(-300));
    const lowestDigits = Math.ceil(Math.log10(lowestRecent));
    const precision = Math.max(0, 5 - lowestDigits);

    const _candleSeries = chart?.addCandlestickSeries({
      priceLineColor: '#333',
      lastValueVisible: false,
      priceFormat: {
        type: 'price',
        minMove: 1 / Math.pow(10, precision),
      },
    });

    _candleSeries?.setData(
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
    chart?.timeScale().setVisibleLogicalRange({
      from: candles.length - 200,
      to: candles.length,
    });

    setCandleSeries(_candleSeries);
    return () => {
      try {
        setCandleSeries(undefined);
        if (_candleSeries) {
          chart?.removeSeries(_candleSeries);
        }
      } catch {}
    };
  }, [chart, candles]);

  return candleSeries;
};

export default useCandleSeries;
