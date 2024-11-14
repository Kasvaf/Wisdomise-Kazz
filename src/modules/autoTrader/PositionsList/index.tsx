import Spinner from 'shared/Spinner';
import { useTraderPositionsQuery } from 'api';
import NoPosition from './NoPosition';
import PositionDetail from './PositionDetail';

const PositionsList: React.FC<{ slug?: string; isOpen: boolean }> = ({
  slug,
  isOpen,
}) => {
  const { data: positions, isLoading } = useTraderPositionsQuery({
    slug,
    isOpen,
  });
  const positionsRes = positions?.positions ?? [];

  return isLoading ? (
    <div className="my-8 flex justify-center">
      <Spinner />
    </div>
  ) : positionsRes.length > 0 ? (
    <div className="flex flex-col gap-3">
      {positionsRes.map(position => (
        <PositionDetail
          key={position.key}
          pairSlug={slug}
          position={position}
        />
      ))}
    </div>
  ) : (
    <NoPosition active={isOpen} />
  );
};

export default PositionsList;
