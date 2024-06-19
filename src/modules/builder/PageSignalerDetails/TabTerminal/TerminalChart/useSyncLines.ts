import { useEffect } from 'react';
import {
  type IChartingLibraryWidget,
  type IChartWidgetApi,
} from 'shared/AdvancedChart/charting_library/charting_library';
import { type SignalFormState } from '../AdvancedSignalForm/useSignalFormStates';

function makeLine({
  chart,
  title,
  price,
  quantity,
  bgColor,
  textColor,
  onChange,
}: {
  chart: IChartWidgetApi;
  title: string;
  price: number;
  quantity?: string;
  bgColor: string;
  textColor: string;
  onChange?: false | ((newPrice: number) => unknown);
}) {
  const ln = chart
    .createOrderLine()
    .setText(title)
    .setPrice(price)
    .setQuantity(quantity ?? '')
    .setBodyTextColor(textColor)
    .setBodyBackgroundColor(bgColor)
    .setBodyBorderColor(bgColor)
    .setLineColor(bgColor)
    .setQuantityBackgroundColor(bgColor)
    .setQuantityBorderColor('#000');

  if (onChange) {
    ln.onMove(() => onChange(ln.getPrice()));
  }

  return ln;
}

const useSyncLines = ({
  widget,
  formState,
  marketPrice,
}: {
  widget?: IChartingLibraryWidget;
  formState: SignalFormState;
  marketPrice?: number;
}) => {
  const {
    isUpdate: [isUpdate],
    orderType: [, setOrderType],
    price: [price, setPrice],
    stopLosses: [stopLosses, setStopLosses],
    takeProfits: [takeProfits, setTakeProfits],
  } = formState;

  useEffect(() => {
    if (!widget) return;

    const lines: Array<{ remove: () => void }> = [];
    function cleanLines() {
      try {
        for (const ln of lines) ln.remove();
        lines.length = 0;
      } catch {}
    }

    // this is very necessary to prevent read-calls (race-condition) after use-effect destructed
    let destructed = false;
    function getChartCleaned() {
      try {
        cleanLines();
        return !destructed && widget?.activeChart();
      } catch {}
    }

    widget.onChartReady(() => {
      const chart = getChartCleaned();
      if (!chart) return;

      if (marketPrice !== undefined) {
        lines.push(
          makeLine({
            chart,
            title: 'Market',
            price: marketPrice,
            bgColor: '#333',
            textColor: '#fff',
          }),
        );
      }

      lines.push(
        makeLine({
          chart,
          title: 'Open',
          price: +price,
          bgColor: '#fff',
          textColor: '#000',
          onChange:
            !isUpdate &&
            (newOpen => {
              setOrderType('limit');
              setPrice(String(newOpen));
            }),
        }),
      );

      for (const [ind, tp] of takeProfits.entries()) {
        const color = tp.applied ? '#095538' : '#11C37E';
        lines.push(
          makeLine({
            chart,
            title: `TP #${String(ind + 1)} (${String(+tp.amountRatio)}%)`,
            price: Number(+tp.priceExact),
            bgColor: color,
            textColor: '#fff',
            onChange: newPrice =>
              setTakeProfits(tps =>
                tps.map(x =>
                  x === tp ? { ...x, priceExact: String(newPrice) } : tp,
                ),
              ),
          }),
        );
      }

      for (const [ind, sl] of stopLosses.entries()) {
        const color = sl.applied ? '#7e1b27' : '#F14056';
        lines.push(
          makeLine({
            chart,
            title: `SL #${String(ind + 1)} (${String(+sl.amountRatio)}%)`,
            price: Number(+sl.priceExact),
            bgColor: color,
            textColor: '#fff',
            onChange: newPrice =>
              setStopLosses(sls =>
                sls.map(x =>
                  x === sl ? { ...x, priceExact: String(newPrice) } : sl,
                ),
              ),
          }),
        );
      }
    });

    return () => {
      destructed = true;
      cleanLines();
    };
  }, [
    widget,
    isUpdate,
    marketPrice,
    price,
    stopLosses,
    takeProfits,
    setOrderType,
    setPrice,
    setStopLosses,
    setTakeProfits,
  ]);
};

export default useSyncLines;
