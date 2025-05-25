import useSearchParamAsState from 'shared/useSearchParamAsState';
import useIsMobile from 'utils/useIsMobile';
import PositionsList from 'modules/autoTrader/PagePositions/PositionsList';

const PositionsCompact = () => {
  const isMobile = useIsMobile();
  const [filter] = useSearchParamAsState<'active' | 'history'>(
    'filter',
    'active',
  );

  return (
    <div>
      <PositionsList isOpen={filter === 'active'} grid={!isMobile} />
    </div>
  );
};

export default PositionsCompact;
