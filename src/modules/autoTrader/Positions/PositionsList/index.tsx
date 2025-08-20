import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import Spinner from 'shared/Spinner';
import { useTraderPositionsQuery } from 'api';
import usePageTour from 'shared/usePageTour';
import NoPosition from './NoPosition';
import PositionDetail from './PositionDetail';

const PAGE_SIZE = 30;
const PositionsList: React.FC<{
  slug?: string;
  isOpen: boolean;
  noEmptyState?: boolean;
  noLoadingState?: boolean;
  grid?: boolean;
  className?: string;
}> = ({ slug, isOpen, noEmptyState, noLoadingState, grid, className }) => {
  const [page, setPage] = useState(1);
  const { data: positions, isLoading } = useTraderPositionsQuery({
    slug,
    isOpen,
    pageSize: PAGE_SIZE,
    page,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    setPage(1);
  }, [isOpen, slug]);

  const positionsRes = positions?.positions ?? [];

  const someSharable = positionsRes.some(
    ({ status }) => status === 'CLOSED' || status === 'OPEN',
  );
  usePageTour({
    key: 'share-position',
    enabled: someSharable,
    steps: [
      {
        selector: '.id-tour-share',
        content: (
          <>
            <div className="mb-2 font-semibold">
              Share your trade card to earn more.
            </div>
            <div>
              Show your performance and get referrals through your unique link
              and QR code.
            </div>
          </>
        ),
      },
    ],
  });

  return isLoading ? (
    <>
      {!noLoadingState && (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      )}
    </>
  ) : positionsRes.length > 0 ? (
    <div className={className}>
      <div
        className={
          grid ? 'grid grid-cols-2 gap-3 xl:grid-cols-3' : 'flex flex-col gap-3'
        }
      >
        {positionsRes.map(position => (
          <PositionDetail key={position.key} position={position} />
        ))}
      </div>

      <div className="mt-3 flex justify-center empty:hidden">
        <Pagination
          current={page}
          onChange={x => setPage(x)}
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
