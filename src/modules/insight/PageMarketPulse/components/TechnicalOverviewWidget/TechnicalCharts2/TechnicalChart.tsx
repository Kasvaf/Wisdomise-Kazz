import { useMemo, type FC } from 'react';
import { Scatter, type ScatterConfig } from '@ant-design/plots';
import { type TechnicalRadarCoin } from 'api/market-pulse';

export const TechnicalChart: FC<{
  type: 'cheap_bullish' | 'expensive_bearish';
  data: TechnicalRadarCoin[];
}> = ({ data, type }) => {
  const config = useMemo<ScatterConfig>(() => {
    const xValues = new Set<number>();
    const yValues = new Set<number>();
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
      .sort((a, b) => Math.abs(b.score ?? 0) - Math.abs(a.score ?? 0))
      .slice(0, 10)
      .map(raw => {
        let x = raw.macd_score ?? 0;
        let y = raw.rsi_score ?? 0;
        while (xValues.has(x)) {
          x += 1;
        }
        while (yValues.has(y)) {
          y += 1;
        }
        xValues.add(x);
        yValues.add(y);
        return {
          raw,
          x,
          y,
          size: Math.abs(raw.data?.price_change_percentage_24h ?? 0),
          image: raw.symbol.logo_url,
          label: raw.symbol.abbreviation,
          borderColor:
            (raw.data?.price_change_percentage_24h ?? 0) > 0
              ? '#00FFA3'
              : '#EA3E55',
        };
      });
    const minDistance = -1;
    for (let i = 0; i < parsedData.length; i++) {
      for (let j = i + 1; j < parsedData.length; j++) {
        const pointA = parsedData[i];
        const pointB = parsedData[j];

        const dx = pointB.x - pointA.x;
        const dy = pointB.y - pointA.y;
        const distance = Math.hypot(dx, dy);
        const minAllowedDistance =
          pointA.size / 2 + pointB.size / 2 + minDistance;

        if (distance < minAllowedDistance) {
          // Adjust position
          const overlap = minAllowedDistance - distance;
          const angle = Math.atan2(dy, dx);
          pointB.x += overlap * Math.cos(angle);
          pointB.y += overlap * Math.sin(angle);
        }
      }
    }

    return {
      appendPadding: 30,
      data: parsedData,
      xField: 'x',
      yField: 'y',
      colorField: 'borderColor',
      pointStyle: x => {
        return {
          fill: '#36374a',
          fillOpacity: 1,
          stroke: x.borderColor,
        };
      },
      sizeField: 'size',
      size: [10, 30],
      shape: 'circle',
      yAxis: false,
      xAxis: false,
      brush: {
        enabled: true,
      },
      // tooltip: true,
      legend: false,

      label: {
        formatter: x => {
          return x.label;
        },
        offsetY: 13,
        style: {
          fill: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
        },
      },
      style: {
        background:
          type === 'cheap_bullish'
            ? 'linear-gradient(225deg, #00FFA3, transparent)'
            : 'linear-gradient(225deg, #EA3E55, transparent)',
      },
      renderer: 'canvas',
    };
  }, [data, type]);

  return (
    <div className="relative">
      <Scatter {...config} />
    </div>
  );
};
