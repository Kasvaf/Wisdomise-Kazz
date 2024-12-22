import { type FC } from 'react';
import { useTechnicalRadarTopCoins } from 'api/market-pulse';
import { TechnicalChartWidget } from './TechnicalChartWidget';

export const TechnicalCharts: FC = () => {
  const technicalTopCoins = useTechnicalRadarTopCoins();

  return (
    <div className="grid grid-cols-2 gap-6 mobile:grid-cols-1">
      <TechnicalChartWidget
        data={technicalTopCoins.data ?? []}
        type="cheap_bullish"
      />
      <TechnicalChartWidget
        data={technicalTopCoins.data ?? []}
        type="expensive_bearish"
      />
    </div>
  );
};
