import { useMemo, type FC } from 'react';
import { Scatter, type ScatterConfig } from '@ant-design/plots';
import { type TechnicalRadarCoin } from 'api/market-pulse';

export const TechnicalChart: FC<{
  type: 'cheap_bullish' | 'expensive_bearish';
  data: TechnicalRadarCoin[];
}> = ({ data, type }) => {
  const config = useMemo<ScatterConfig>(() => {
    const parsedData = data
      .filter(x => {
        const isScoreMatched =
          type === 'cheap_bullish' ? (x.score ?? 0) > 0 : (x.score ?? 0) < 0;
        if (type === 'cheap_bullish') {
          return (x.score ?? 0) > 0;
        }
        return (
          isScoreMatched &&
          typeof x.data?.price_change_percentage_24h === 'number' &&
          typeof x.rsi_score === 'number' &&
          typeof x.macd_score === 'number'
        );
      })
      .map(raw => {
        return {
          raw,
          x: raw.macd_score ?? 0,
          y: raw.rsi_score ?? 0,
          size: raw.data?.price_change_percentage_24h ?? 0,
          label: raw.symbol.abbreviation,
          color:
            (raw.data?.price_change_percentage_24h ?? 0) > 0
              ? 'r(0.4, 0.3, 0.7) 0:rgba(255,255,255,1) 1:#00FFA3'
              : 'r(0.4, 0.4, 0.7) 0:rgba(255,255,255,1) 1:#EA3E55',
        };
      });
    return {
      appendPadding: 30,
      data: parsedData,
      xField: 'x',
      yField: 'y',
      colorField: 'color',
      color: x => {
        return x.color;
      },
      sizeField: 'size',
      size: [5, 26],
      shape: 'circle',
      yAxis: {
        nice: true,
        line: {
          style: {
            stroke: '#eee',
          },
        },
      },
      xAxis: {
        grid: {
          line: {
            style: {
              stroke: '#eee',
            },
          },
        },
        line: {
          style: {
            stroke: '#eee',
          },
        },
      },
      brush: {
        enabled: true,
        mask: {
          style: {
            fill: 'rgba(255,0,0,0.15)',
          },
        },
      },
      label: {
        formatter: x => {
          return x.label;
        },
        // // type: 'inner',
        // position: 'middle',
        // layout: 'limitInShape',
        style: {
          fill: 'white',
        },
      },
    };
  }, [data, type]);

  return (
    <div className="relative">
      <Scatter {...config} />
    </div>
  );
};
