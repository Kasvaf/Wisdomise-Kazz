import { useFpiPositionHistory } from 'api/fpi';
import PositionsTimeline from 'modules/strategy/PositionsTimeline';
import useRangeSelector from 'modules/strategy/PositionsTimeline/useRangeSelector';

interface Props {
  strategyId?: string;
  className?: string;
}

const CockpitTimeline: React.FC<Props> = ({ strategyId, className }) => {
  const ranger = useRangeSelector();
  const { range } = ranger;

  // TODO: use strategy-cockpit api
  const history = useFpiPositionHistory({
    fpiKey: strategyId,
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
