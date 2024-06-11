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
}: {
  chart?: IChartApi;
  candleSeries?: ISeriesApi<'Candlestick', any>;
  formState: SignalFormState;
}) => {
  useEffect(() => {
    if (!chart || !candleSeries) return;

    const openLines = addPriceLines({
      series: candleSeries,
      items: [
        {
          price: Number(+formState.price[0]),
          color: '#fff',
        },
      ],
      prefix: 'Open',
    });

    const tpLines = addPriceLines({
      series: candleSeries,
      items: formState.takeProfits[0].map(x => ({
        price: Number(+x.priceExact),
        color: x.applied ? '#095538' : '#11C37E',
      })),
      prefix: 'TP',
    });

    const slLines = addPriceLines({
      series: candleSeries,
      items: formState.stopLosses[0].map(x => ({
        price: Number(+x.priceExact),
        color: x.applied ? '#7e1b27' : '#F14056',
      })),
      prefix: 'SL',
    });

    return () => {
      for (const ln of [...openLines, ...tpLines, ...slLines]) {
        candleSeries.removePriceLine(ln);
      }
    };
  }, [
    chart,
    candleSeries,
    formState.price,
    formState.stopLosses,
    formState.takeProfits,
  ]);
};

export default useSignalerPriceLines;
