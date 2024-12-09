import { useMemo } from 'react';
import { type TechnicalRadarCoin } from 'api/market-pulse';

export const useNormalizeTechnicalChartBubbles = (
  data: TechnicalRadarCoin[],
  type: 'cheap_bullish' | 'expensive_bearish',
) =>
  useMemo(() => {
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
        const x = Math.abs(raw.macd_score ?? 0);
        const y = Math.abs(raw.rsi_score ?? 0);
        const size = Math.abs(raw.data?.price_change_percentage_24h ?? 0);

        const color =
          (raw.data?.price_change_percentage_24h ?? 0) > 0
            ? '#00FFA3'
            : '#EA3E55';
        const image = raw.symbol.logo_url;
        const label = raw.symbol.abbreviation;
        return {
          raw,
          x,
          y,
          size,
          image,
          label,
          color,
        };
      });
    return parsedData;
  }, [data, type]);
