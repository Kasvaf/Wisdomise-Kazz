import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFpiPositionHistory } from 'api/fpi';
import Pager from 'shared/Pager';
import Spinner from 'shared/Spinner';
import PositionsTable from './PositionsTable';

const PAGE_SIZE = 7;
const FPIPositionHistory: React.FC<{ fpiKey?: string; className?: string }> = ({
  fpiKey,
  className,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const history = useFpiPositionHistory({
    fpiKey,
    offset: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
  });

  let content = <></>;
  if (history.data?.total == null) {
    if (history.isLoading)
      content = (
        <div className="flex justify-center">
          <Spinner />
        </div>
      );
  } else {
    content = (
      <>
        <PositionsTable history={history.data.position_history} />
        <Pager
          total={Math.ceil(history.data.total / PAGE_SIZE)}
          active={page}
          onChange={setPage}
          className="mx-auto mt-4 justify-center"
        />
      </>
    );
  }

  return (
    <div className={className}>
      <h1 className="mb-4 text-lg font-semibold text-white">
        {t('strategy:positions-history.title')}
      </h1>
      {content}
    </div>
  );
};

export default FPIPositionHistory;
