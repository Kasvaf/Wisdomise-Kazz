import { useSearchParams } from 'react-router-dom';
import { useBestPerformingQuery } from 'api';
import Spinner from 'shared/Spinner';
import SimulatedPositionsTable from '../signaler/SimulatedPositionsTable';

const BestPerforming = () => {
  const [params] = useSearchParams();
  const { data: positions, isLoading } = useBestPerformingQuery(
    Number.parseInt(params.get('tab') || '7'),
  );

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
      withStrategy
      withCoins
    />
  );
};

export default BestPerforming;
