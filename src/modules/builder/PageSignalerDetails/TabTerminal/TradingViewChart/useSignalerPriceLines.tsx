import {
  type ISeriesApi,
  LineStyle,
  type LineWidth,
  type IChartApi,
} from 'lightweight-charts';
import { useEffect } from 'react';
import { type SignalFormState } from '../AdvancedSignalForm/useSignalFormStates';

const addPriceLines = ({
  series,
  items,
  prefix,
}: {
  series: ISeriesApi<'Candlestick', any>;
  items: Array<{ price: number; color: string }>;
  prefix: string;
}) => {
  return items
    .filter(e => !Number.isNaN(e.price))
    .map(({ price, color }, i) =>
      series.createPriceLine({
        title: prefix + ' #' + String(i + 1),
        price,
        color,
        lineWidth: 2 as LineWidth,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
      }),
    );
};

const useSignalerPriceLines = ({
  chart,
  candleSeries,
  formState,
  marketPrice,
}: {
  chart?: IChartApi;
  candleSeries?: ISeriesApi<'Candlestick', any>;
  formState: SignalFormState;
  marketPrice?: number;
}) => {
  useEffect(() => {
    if (!chart || !candleSeries) return;

    const otherLines = [
      candleSeries.createPriceLine({
        title: 'Open',
        price: Number(+formState.price[0]),
        color: '#fff',
        lineWidth: 2 as LineWidth,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
      }),
    ];

    if (marketPrice) {
      otherLines.push(
        candleSeries.createPriceLine({
          title: 'Market',
          price: marketPrice,
          color: '#333',
          lineWidth: 2 as LineWidth,
          lineStyle: LineStyle.Solid,
          axisLabelVisible: true,
        }),
      );
    }

    const tpLines = addPriceLines({
      series: candleSeries,
      items: formState.takeProfits[0]
        .filter(x => !x.removed)
        .map(x => ({
          price: Number(+x.priceExact),
          color: x.applied ? '#095538' : '#11C37E',
        })),
      prefix: 'TP',
    });

    const slLines = addPriceLines({
      series: candleSeries,
      items: formState.stopLosses[0]
        .filter(x => !x.removed)
        .map(x => ({
          price: Number(+x.priceExact),
          color: x.applied ? '#7e1b27' : '#F14056',
        })),
      prefix: 'SL',
    });

    return () => {
      try {
        for (const ln of [...otherLines, ...tpLines, ...slLines]) {
          candleSeries.removePriceLine(ln);
        }
      } catch {}
    };
  }, [
    chart,
    candleSeries,
    formState.price,
    formState.stopLosses,
    formState.takeProfits,
    marketPrice,
  ]);
};

export default useSignalerPriceLines;
