import { Pagination } from 'antd';
import Spinner from 'shared/Spinner';
import { useTraderPositionsQuery } from 'api';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import useIsMobile from 'utils/useIsMobile';
import NoPosition from './NoPosition';
import PositionDetail from './PositionDetail';

const PAGE_SIZE = 30;
const PositionsList: React.FC<{
  slug?: string;
  isOpen: boolean;
  noEmptyState?: boolean;
}> = ({ slug, isOpen, noEmptyState }) => {
  const isMobile = useIsMobile();
  const [page, setPage] = useSearchParamAsState<string>('page', '1');
  const { data: positions, isLoading } = useTraderPositionsQuery({
    slug,
    isOpen,
    pageSize: PAGE_SIZE,
    page: +page,
  });
  const positionsRes = positions?.positions ?? [];

  return isLoading ? (
    <div className="my-8 flex justify-center">
      <Spinner />
    </div>
  ) : positionsRes.length > 0 ? (
    <div>
      <div
        className={
          isMobile
            ? 'flex flex-col gap-3'
            : 'grid grid-cols-2 gap-3 xl:grid-cols-3'
        }
      >
        {positionsRes.map(position => (
          <PositionDetail key={position.key} position={position} />
        ))}
      </div>

      <div className="mt-3 flex justify-center">
        <Pagination
          current={+page}
          onChange={x => setPage(String(x))}
          pageSize={PAGE_SIZE}
          total={positions?.count}
          hideOnSinglePage
          responsive
        />
      </div>
    </div>
  ) : (
    <>{!noEmptyState && <NoPosition active={isOpen} slug={slug} />}</>
  );
};

export default PositionsList;
