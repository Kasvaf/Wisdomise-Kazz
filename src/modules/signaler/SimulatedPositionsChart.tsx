import { useRecentCandlesQuery } from 'api';
import { type RawPosition } from 'api/types/signalResponse';
import CandleChart from 'shared/CandleChart';

const SimulatedPositionsChart: React.FC<{
  asset: string;
  positions: RawPosition[];
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

export default SimulatedPositionsChart;
