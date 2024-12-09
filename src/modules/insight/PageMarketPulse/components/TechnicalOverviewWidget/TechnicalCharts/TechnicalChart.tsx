import { useMemo, type FC } from 'react';
import { Scatter, type ScatterConfig } from '@ant-design/plots';
import { type TechnicalRadarCoin } from 'api/market-pulse';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import { antChartTooltipConfig } from 'shared/HoverTooltip';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useNormalizeTechnicalChartBubbles } from './useNormalizeTechnicalChartBubbles';

export const TechnicalChart: FC<{
  type: 'cheap_bullish' | 'expensive_bearish';
  data: TechnicalRadarCoin[];
}> = ({ data, type }) => {
  const parsedData = useNormalizeTechnicalChartBubbles(data, type);

  const config = useMemo<ScatterConfig>(() => {
    return {
      padding: [32, 32, 42, 42],
      appendPadding: 0,
      // syncViewPadding: 150,
      data: parsedData,
      xField: 'x',
      yField: 'y',
      colorField: 'color',
      pointStyle: x => {
        return {
          fill: 'rgba(0, 0, 0, 0.2)',
          fillOpacity: 1,
          stroke: x.color,
          lineWidth: 2,
          shadowColor: x.color,
          shadowBlur: 15,
        };
      },
      sizeField: 'size',
      size: [19, 40],
      shape: 'circle',
      yAxis: {
        nice: true,
        label: null,
        line: null,
        grid: {
          line: {
            style: {
              stroke: 'rgba(255, 255, 255, 0.15)',
              lineWidth: 1,
              lineDash: [2, 2],
            },
          },
        },
        tickCount: 10,
        title: {
          text: '~RSI Wise Scoring',
          position: 'center',
          style: {
            fill: '#fff',
          },
          offset: 20,
        },
      },
      xAxis: {
        nice: true,
        label: null,
        line: null,
        grid: {
          line: {
            style: {
              stroke: 'rgba(255, 255, 255, 0.15)',
              lineWidth: 1,
              lineDash: [2, 2],
            },
          },
        },
        tickCount: 10,
        title: {
          text: '~MACD Wise Scoring',
          position: 'center',
          style: {
            fill: '#fff',
          },
          offset: 20,
        },
      },
      brush: {
        enabled: true,
      },
      tooltip: {
        ...antChartTooltipConfig,
        customContent: (_, data) => {
          const item: TechnicalRadarCoin | undefined = data[0]?.data?.raw;
          if (!item) return;
          return (
            <div>
              <div>
                <Coin
                  coin={item.symbol}
                  popup={false}
                  nonLink
                  truncate={false}
                />
              </div>
              <p className="flex justify-between gap-1">
                <strong>{'~RSI Score:'}</strong>
                <ReadableNumber popup="never" value={item.rsi_score} />
              </p>
              <p className="flex justify-between gap-1">
                <strong>~MACD Score:</strong>
                <ReadableNumber popup="never" value={item.macd_score} />
              </p>
              <p className="flex justify-between gap-1">
                <strong>~Price:</strong>
                <ReadableNumber
                  popup="never"
                  value={item.data?.current_price}
                  label="$"
                />
              </p>
              <p className="flex justify-between gap-1">
                <strong>~Price Change (24H):</strong>
                <DirectionalNumber
                  popup="never"
                  value={item.data?.price_change_percentage_24h}
                  label="%"
                  showIcon
                  showSign
                />
              </p>
            </div>
          );
        },
      },
      legend: false,
      label: {
        formatter: x => {
          return x.label;
        },
        offsetY: 13,
        style: {
          fill: 'white',
          fontWeight: 'bold',
        },
      },
      style: {
        background:
          type === 'cheap_bullish'
            ? 'linear-gradient(225deg, #0A5740, transparent)'
            : 'linear-gradient(225deg, #5D1A22, transparent)',
      },
      renderer: 'canvas',
      className: 'rounded-xl overflow-hidden',
      annotations: [
        {
          type: 'text',
          position: ['max', 'min'], // Position at max x and y=0
          content: type === 'cheap_bullish' ? '~Bullish ➡️' : '~Bearish ➡️',
          style: {
            fill: 'white',
            fontSize: 12,
            textAlign: 'end',
          },
          rotate: 0,
          offsetY: 20, // Adjust position above x-axis
        },
        {
          type: 'text',
          position: ['min', 'max'],
          content: type === 'cheap_bullish' ? '~Cheap ➡️' : '~Expensive ➡️', // NAITODO
          style: {
            fill: 'white',
            fontSize: 12,
            textAlign: 'end',
          },
          rotate: -Math.PI / 2,
          offsetX: -16, // Adjust position to the left of y-axis
        },
      ],
    };
  }, [parsedData, type]);

  return (
    <div className="relative">
      <Scatter {...config} />
    </div>
  );
};
