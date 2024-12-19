import { useMemo } from 'react';
import { type TechnicalRadarCoin } from 'api/market-pulse';

export const useNormalizeTechnicalChartBubbles = (
  data: TechnicalRadarCoin[],
  type: 'cheap_bullish' | 'expensive_bearish',
) =>
  useMemo(() => {
    let bubbles: Array<{
      raw: TechnicalRadarCoin;
      x: number;
      y: number;
      size: number;
      label: string;
      color: string;
    }> = [];
    const filteredData = data
      .filter(x =>
        type === 'cheap_bullish'
          ? (x.score ?? 0) > 0
          : (x.score ?? 0) < 0 &&
            typeof x.rsi_score === 'number' &&
            typeof x.macd_score === 'number',
      )
      .sort((a, b) =>
        type === 'cheap_bullish'
          ? (b.score ?? 0) - (a.score ?? 0)
          : (a.score ?? 0) - (b.score ?? 0),
      );
    let minSize = 0;
    let maxSize = 0;
    for (const raw of filteredData) {
      const x = (raw.macd_score ?? 0) * (type === 'expensive_bearish' ? -1 : 1);
      const y = (raw.rsi_score ?? 0) * (type === 'expensive_bearish' ? -1 : 1);
      const size = Math.abs((raw.data?.price_change_percentage_24h ?? 0) * 5);
      if (size < minSize) minSize = size;
      if (size > maxSize) maxSize = size;
      const color =
        (raw.data?.price_change_percentage_24h ?? 0) > 0
          ? '#00FFA3'
          : '#EA3E55';
      const label = raw.symbol.abbreviation;

      bubbles = [
        ...bubbles,
        {
          raw,
          label,
          color,
          size,
          x,
          y,
        },
      ];

      if (bubbles.length >= 10) break;
    }
    const sizeOffset = 25 - minSize;

    for (const bubbleA of bubbles) {
      bubbleA.size = Math.min(bubbleA.size + sizeOffset, 100);
      for (const bubbleB of bubbles) {
        if (
          Math.abs(bubbleA.x - bubbleB.x) < 0.5 &&
          Math.abs(bubbleA.y - bubbleB.y) < 1
        ) {
          bubbleB.x += 0.5;
        } else if (
          Math.abs(bubbleA.y - bubbleB.y) < 0.5 &&
          Math.abs(bubbleA.x - bubbleB.x) < 1
        ) {
          bubbleB.y += 0.5;
        }
      }
    }
    return {
      data: bubbles,
      minY: Math.min(...bubbles.map(({ y }) => y)),
      maxY: Math.max(...bubbles.map(({ y }) => y)),
      minX: Math.min(...bubbles.map(({ x }) => x)),
      maxX: Math.max(...bubbles.map(({ x }) => x)),
      minSize: Math.min(...bubbles.map(({ size }) => size)),
      maxSize: Math.max(...bubbles.map(({ size }) => size)),
    };
  }, [data, type]);
