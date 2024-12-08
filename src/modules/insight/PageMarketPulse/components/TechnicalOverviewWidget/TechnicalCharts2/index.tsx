import { type FC } from 'react';
import { useTechnicalRadarTopCoins } from 'api/market-pulse';
import { AccessSheild } from 'shared/AccessSheild';
import { TechnicalChart } from './TechnicalChart';

export const TechnicalCharts2: FC = () => {
  const technicalTopCoins = useTechnicalRadarTopCoins();

  if (technicalTopCoins.data?.length === 0) return null;

  return (
    <AccessSheild
      mode="children"
      size={2}
      level={1}
      className="grid grid-cols-2 gap-6 mobile:grid-cols-1"
    >
      <div className="space-y-6 rounded-xl bg-v1-surface-l3 p-6">
        <div className="space-y-1">
          <h2 className="text-base font-medium text-v1-content-primary [&_b]:text-v1-content-positive">
            ~<b>Cheap & Bullish</b> Chart(RSI+MACD)
          </h2>
          <p className="text-xs capitalize text-v1-content-primary">
            {'~the size of each bubble reflects the 24-hour change.'}
          </p>
        </div>
        <div>
          <TechnicalChart
            data={technicalTopCoins.data ?? []}
            type="cheap_bullish"
          />
        </div>
      </div>
      <div className="space-y-6 rounded-xl bg-v1-surface-l3 p-6">
        <div className="space-y-1">
          <h2 className="text-base font-medium text-v1-content-primary [&_b]:text-v1-content-negative">
            ~<b>Expensive & Bearish</b> Chart(RSI+MACD)
          </h2>
          <p className="text-xs capitalize text-v1-content-primary">
            {'~the size of each bubble reflects the 24-hour change.'}
          </p>
        </div>
        <div>
          <TechnicalChart
            data={technicalTopCoins.data ?? []}
            type="expensive_bearish"
          />
        </div>
      </div>
    </AccessSheild>
  );
};
