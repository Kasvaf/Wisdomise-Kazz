import { useFpiPositionHistory } from 'api/fpi';
import PositionsTimeline from './PositionsTimeline';
import useRangeSelector from './PositionsTimeline/useRangeSelector';

interface Props {
  fpiKey?: string;
  className?: string;
}

const FPITimeline: React.FC<Props> = ({ fpiKey, className }) => {
  const ranger = useRangeSelector();
  const { range } = ranger;
  const history = useFpiPositionHistory({
    fpiKey,
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

export default FPITimeline;
