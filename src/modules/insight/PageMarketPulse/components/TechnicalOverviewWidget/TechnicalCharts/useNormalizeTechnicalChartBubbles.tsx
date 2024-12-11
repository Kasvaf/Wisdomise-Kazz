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
    for (const raw of filteredData) {
      const x = (raw.macd_score ?? 0) * (type === 'expensive_bearish' ? -1 : 1);
      const y = (raw.rsi_score ?? 0) * (type === 'expensive_bearish' ? -1 : 1);
      const size = Math.abs(raw.data?.price_change_percentage_24h ?? 0);
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

    // const minX = Math.min(...bubbles.map(({ x }) => x));
    // const minY = Math.min(...bubbles.map(({ y }) => y));
    // for (const bubble of bubbles) {
    //   bubble.x += Math.abs(minX);
    //   bubble.y += Math.abs(minY);
    //   if (type === 'expensive_bearish') {
    //     bubble.y =
    //   }
    // }

    for (const bubbleA of bubbles) {
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
    return bubbles;
  }, [data, type]);
