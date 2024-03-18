import { useSearchParams } from 'react-router-dom';
import { useBestPerformingQuery } from 'api';
import Spinner from 'shared/Spinner';
import SimulatedPositionsTable from '../signaler/SimulatedPositionsTable';

const BestPerforming = () => {
  const [params] = useSearchParams();
  const days = Number.parseInt(params.get('tab') || '7');
  const { data: positions, isLoading } = useBestPerformingQuery({
    days: Number.parseInt(params.get('tab') || '7'),
    limit: days === 30 ? 50 : 30,
  });

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center">
        <Spinner />
      </div>
    );
  }
  if (!positions) return null;

  return (
    <SimulatedPositionsTable
      items={positions}
      pagination={false}
      withNumbering
      withStrategy
      withCoins
    />
  );
};

export default BestPerforming;
