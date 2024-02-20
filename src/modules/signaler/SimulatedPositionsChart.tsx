import { useRecentCandlesQuery } from 'api';
import CandleChart from 'shared/CandleChart';

interface Position {
  entry_time: string;
  entry_price: number;
  exit_time?: string;
  exit_price?: number;
  position_side: 'LONG' | 'SHORT';
  pnl: number;
}

const SimulatedPositionsChart: React.FC<{
  asset: string;
  positions: Position[];
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
