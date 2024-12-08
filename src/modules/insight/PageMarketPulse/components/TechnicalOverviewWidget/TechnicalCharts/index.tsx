import { type FC } from 'react';
import { useTechnicalRadarTopCoins } from 'api/market-pulse';
import { AccessSheild } from 'shared/AccessSheild';
import { TechnicalChart } from './TechnicalChart';

export const TechnicalCharts: FC = () => {
  const technicalTopCoins = useTechnicalRadarTopCoins();

  const cheapAndBullish = (
    technicalTopCoins.data?.filter(
      x =>
        (x.score ?? 0) > 0 &&
        typeof x.data?.price_change_percentage_24h === 'number',
    ) ?? []
  )
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 10);
  const expensiveAndBearish = (
    technicalTopCoins.data?.filter(
      x =>
        (x.score ?? 0) < 0 &&
        typeof x.data?.price_change_percentage_24h === 'number',
    ) ?? []
  )
    .sort((a, b) => Math.abs(b.score ?? 0) - Math.abs(a.score ?? 0))
    .slice(0, 10);

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
          <TechnicalChart data={cheapAndBullish} type="cheap_bullish" />
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
          <TechnicalChart data={expensiveAndBearish} type="expensive_bearish" />
        </div>
      </div>
    </AccessSheild>
  );
};
