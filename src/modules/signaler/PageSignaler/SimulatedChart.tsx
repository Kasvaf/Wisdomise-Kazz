import { useRecentCandlesQuery } from 'api';
import { type PairSignalerItem } from 'api/signaler';
import CandleChart from 'shared/CandleChart';

const SimulatedChart: React.FC<{
  asset: string;
  positions: PairSignalerItem[];
}> = ({ positions, asset }) => {
  const { data: candles, isLoading: candlesLoading } =
    useRecentCandlesQuery(asset);

  return (
    <>
      {candles && !candlesLoading && (
        <CandleChart
          candles={candles}
          resolution="1h"
          positions={positions.map(p => ({
            actual_position: p,
            strategy_position: p,
          }))}
        />
      )}
    </>
  );
};

export default SimulatedChart;
