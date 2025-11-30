import { useOrdersQuery } from 'api/order';
import { slugToTokenAddress, useTokenInfo } from 'api/token-info';
import type { SwapState } from 'modules/autoTrader/BuySellTrader/useSwapState';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { orderTypeMap } from 'modules/discovery/DetailView/CoinDetail/CoinDetailsExpanded/Orders';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useEffect, useRef } from 'react';
import { useAdvancedChartWidget } from 'shared/AdvancedChart/ChartWidgetProvider';
import {
  useChartConvertToUSD,
  useChartIsMarketCap,
} from 'shared/AdvancedChart/chartSettings';
import { formatNumber } from 'utils/numbers';

export function useLimitLineSync(state: SwapState) {
  const [widget] = useAdvancedChartWidget();
  const [chartIsMC] = useChartIsMarketCap();
  const [chartIsUSD] = useChartConvertToUSD();
  const objectsRef = useRef<any[]>([]);
  const { marketData, symbol } = useUnifiedCoinDetails();
  const [activeQuote] = useActiveQuote();
  const { data: quoteInfo } = useTokenInfo({ slug: activeQuote });
  const { data: orders } = useOrdersQuery({
    status: 'PENDING',
    priceInUsd: chartIsUSD,
    baseAddress: symbol.contractAddress ?? undefined,
    quoteAddress: slugToTokenAddress(activeQuote),
  });

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
    if (!widget || !marketData.totalSupply) return;

    const limitIsMC = state.limitType === 'market_cap';
    const isMatched = (limitIsMC && chartIsMC) || (!limitIsMC && !chartIsMC);
    const limit =
      +state.limit *
      (isMatched
        ? 1
        : chartIsMC && !limitIsMC
          ? marketData.totalSupply
          : !chartIsMC && limitIsMC
            ? 1 / marketData.totalSupply
            : 1);

    try {
      widget.subscribe('drawing_event', (sourceId, drawingEventType) => {
        if (
          drawingEventType === 'move' ||
          drawingEventType === 'points_changed'
        ) {
          const shape = widget.activeChart().getShapeById(sourceId);
          const points = shape.getPoints();
          const newLimit = points[0].price;
          state.setLimit(
            String(
              ((newLimit - limit) / 2 + limit) *
                (isMatched
                  ? 1
                  : chartIsMC && !limitIsMC
                    ? 1 / (marketData.totalSupply ?? 0)
                    : !chartIsMC && limitIsMC
                      ? (marketData.totalSupply ?? 0)
                      : 1),
            ),
          );
        }
      });
    } catch {}

    widget.onChartReady(() => {
      const chart = getChartCleaned();
      if (!chart) return;

      chart.dataReady(() => {
        for (const order of orders?.results ?? []) {
          const priceOrMC =
            +order.price * (chartIsMC ? (marketData.totalSupply ?? 0) : 1);
          const formatedPriceOrMC = formatNumber(
            +order.price * (chartIsMC ? (marketData.totalSupply ?? 0) : 1),
            {
              decimalLength: 2,
              compactInteger: true,
              minifyDecimalRepeats: true,
              separateByComma: false,
            },
          );
          const formatedAmount = formatNumber(+order.amount, {
            decimalLength: 2,
            compactInteger: true,
            minifyDecimalRepeats: true,
            separateByComma: false,
          });
          const side =
            order.type === 'BUY_ABOVE' || order.type === 'BUY_BELOW'
              ? 'LONG'
              : 'SHORT';
          const text = `${orderTypeMap[order.type].label} ${chartIsUSD ? '$' : ''}${formatedPriceOrMC}${chartIsUSD ? '' : quoteInfo?.symbol}${chartIsMC ? ' MC' : ''} | ${formatedAmount} ${side === 'LONG' ? quoteInfo?.symbol : symbol.abbreviation}`;
          const l = chart.createShape(
            {
              time: Date.now() / 1000,
              price: priceOrMC,
            },
            {
              shape: 'horizontal_line',
              text,
              overrides: {
                linecolor: side === 'LONG' ? '#3ec2ab' : '#eb6085',
                textcolor: side === 'LONG' ? '#3ec2ab' : '#eb6085',
                linestyle: 2, // 0=solid, 1=dotted, 2=dashed
                linewidth: 2,
                showLabel: true,
                horzLabelsAlign: 'center', // left | center | right
                vertLabelsAlign: 'bottom', // top | middle | bottom
              },
              disableSelection: true,
              disableSave: true,
              lock: true,
            },
          );
          objectsRef.current.push(l);
        }

        if (!state.isMarketPrice) {
          const l = chart.createShape(
            {
              time: Date.now() / 1000,
              price: limit,
            },
            {
              shape: 'horizontal_line',
              text: 'Limit Order Target',
              overrides: {
                linecolor: '#dee33c',
                textcolor: '#fff',
                linestyle: 2, // 0=solid, 1=dotted, 2=dashed
                linewidth: 2,
                showLabel: true,
                horzLabelsAlign: 'right', // left | center | right
                vertLabelsAlign: 'bottom', // top | middle | bottom
              },
              disableSelection: true,
              disableSave: true,
            },
          );
          objectsRef.current.push(l);
        }
      });
    });

    return () => {
      destructed = true;
      cleanLines();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    widget,
    state.limit,
    state.isMarketPrice,
    marketData.totalSupply,
    state.limitType,
    chartIsMC,
    orders,
  ]);
}
