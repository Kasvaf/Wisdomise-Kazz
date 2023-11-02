import { useStrategyHistoryQuery } from 'api';
import PositionsTimeline from 'modules/strategy/PositionsTimeline';
import useRangeSelector from 'modules/strategy/PositionsTimeline/useRangeSelector';

interface Props {
  strategyId?: string;
  className?: string;
}

const CockpitTimeline: React.FC<Props> = ({ strategyId, className }) => {
  const ranger = useRangeSelector();
  const { range } = ranger;

  const history = useStrategyHistoryQuery({
    strategyKey: strategyId,
    start_datatime: range.start.toISOString(),
    end_datetime: range.end.toISOString(),
  });

  return (
    <PositionsTimeline
      history={history.data?.position_history}
      isLoading={history.isLoading}
      ranger={ranger}
      className={className}
    />
  );
};

export default CockpitTimeline;
