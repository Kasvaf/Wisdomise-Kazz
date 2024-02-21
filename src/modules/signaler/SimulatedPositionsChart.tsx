import { type Candle } from 'api';
import { type RawPosition } from 'api/types/signalResponse';
import CandleChart from 'shared/CandleChart';

const SimulatedPositionsChart: React.FC<{
  loading?: boolean;
  candles?: Candle[];
  positions: RawPosition[];
}> = ({ loading, candles, positions }) => {
  return (
    <>
      {candles && !loading && (
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
