import { useEffect } from 'react';
import {
  type IChartingLibraryWidget,
  type IChartWidgetApi,
} from 'shared/AdvancedChart/charting_library/charting_library';
import {
  sortTpSlItems,
  type SignalFormState,
} from '../AdvancedSignalForm/useSignalFormStates';

function makeLine({
  chart,
  title,
  price,
  quantity,
  bgColor,
  textColor,
  editable,
  onChange,
  onRemove,
}: {
  chart: IChartWidgetApi;
  title: string;
  price: number;
  quantity?: string;
  bgColor: string;
  textColor: string;
  editable?: boolean;
  onChange?: false | ((newPrice: number) => unknown);
  onRemove?: false | (() => unknown);
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

  if (onRemove && editable) {
    ln.setCancellable(true)
      .setCancelButtonBackgroundColor(bgColor)
      .setCancelButtonBorderColor(bgColor)
      .setCancelTooltip('Remove')
      .setCancelButtonIconColor(textColor)
      .onCancel(onRemove);
  }
  if (onChange && editable) {
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
    orderType: [orderType, setOrderType],
    price: [price, setPrice],
    market: [market],
    stopLosses: [stopLosses, setStopLosses],
    takeProfits: [takeProfits, setTakeProfits],
    safetyOpens: [safetyOpens, setSafetyOpens],
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

      if (marketPrice != null) {
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

      if (orderType === 'limit' || isUpdate) {
        lines.push(
          makeLine({
            chart,
            title: 'Open',
            price: +price,
            bgColor: '#fff',
            textColor: '#000',
            editable: true,
            onChange:
              !isUpdate &&
              (newOpen => {
                setOrderType('limit');
                setPrice(String(newOpen));
              }),
          }),
        );
      }

      for (const [ind, so] of safetyOpens.entries()) {
        if (so.removed) continue;
        const color = so.applied ? '#0d3f58' : '#34A3DA';
        lines.push(
          makeLine({
            chart,
            title: `SO #${String(ind + 1)} (${String(+so.amountRatio)}%)`,
            price: Number(+so.priceExact),
            bgColor: color,
            textColor: '#fff',
            editable: !so.applied,
            onChange: newPrice =>
              setSafetyOpens(tps =>
                tps.map(x =>
                  x.key === so.key ? { ...x, priceExact: String(newPrice) } : x,
                ),
              ),
            onRemove: () =>
              setSafetyOpens(tps =>
                tps.map(x => (x.key === so.key ? { ...x, removed: true } : x)),
              ),
          }),
        );
      }

      for (const [ind, tp] of takeProfits.entries()) {
        if (tp.removed) continue;
        const color = tp.applied ? '#095538' : '#11C37E';
        lines.push(
          makeLine({
            chart,
            title: `TP #${String(ind + 1)} (${String(+tp.amountRatio)}%)`,
            price: Number(+tp.priceExact),
            bgColor: color,
            textColor: '#fff',
            editable: !tp.applied,
            onChange: newPrice =>
              setTakeProfits(tps =>
                sortTpSlItems({
                  items: tps.map(x =>
                    x.key === tp.key
                      ? { ...x, priceExact: String(newPrice) }
                      : x,
                  ),
                  market,
                  type: 'TP',
                }),
              ),
            onRemove: () =>
              setTakeProfits(tps =>
                tps.map(x => (x.key === tp.key ? { ...x, removed: true } : x)),
              ),
          }),
        );
      }

      for (const [ind, sl] of stopLosses.entries()) {
        if (sl.removed) continue;
        const color = sl.applied ? '#7e1b27' : '#F14056';
        lines.push(
          makeLine({
            chart,
            title: `SL #${String(ind + 1)} (${String(+sl.amountRatio)}%)`,
            price: Number(+sl.priceExact),
            bgColor: color,
            textColor: '#fff',
            editable: !sl.applied,
            onChange: newPrice =>
              setStopLosses(sls =>
                sortTpSlItems({
                  items: sls.map(x =>
                    x.key === sl.key
                      ? { ...x, priceExact: String(newPrice) }
                      : x,
                  ),
                  market,
                  type: 'SL',
                }),
              ),
            onRemove: () =>
              setStopLosses(tps =>
                tps.map(x => (x.key === sl.key ? { ...x, removed: true } : x)),
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
    orderType,
    marketPrice,
    price,
    market,
    safetyOpens,
    stopLosses,
    takeProfits,
    setOrderType,
    setPrice,
    setStopLosses,
    setTakeProfits,
    setSafetyOpens,
  ]);
};

export default useSyncLines;
