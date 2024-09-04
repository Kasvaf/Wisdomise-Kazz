import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  bxChevronLeft,
  bxChevronRight,
  bxRightArrowAlt,
} from 'boxicons-quasar';
import { usePairsWithSignalers } from 'api';
import PairSignals from 'modules/insight/signaler/PageSignalersOverview/PairSignals';
import Icon from 'shared/Icon';
import FabButton from 'shared/FabButton';
import useIsMobile from 'utils/useIsMobile';
import Spinner from 'shared/Spinner';

const SectionSignals: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [page, setPage] = useState(1);
  const { data, isLoading } = usePairsWithSignalers();

  const content = isLoading ? (
    <div className="flex justify-center">
      <Spinner />
    </div>
  ) : (
    data
      .slice(page - 1, page)
      .map(({ pair, signalers }) => (
        <PairSignals
          key={pair.name}
          pair={pair}
          signalers={signalers}
          noCoinBorder
        />
      ))
  );

  return (
    <div className={clsx('rounded-2xl bg-v1-surface-l2 p-6', className)}>
      <div className="mb-8 flex items-center justify-between">
        <div>{t('base:menu.signalers.title')}</div>

        {!isMobile && !isLoading && (
          <div className="flex items-center gap-1 text-v1-content-secondary">
            <span className="text-v1-content-primary">{page}</span>/
            <span>{data.length}</span>
            <FabButton
              icon={bxChevronLeft}
              alt
              className="ml-2"
              disabled={page <= 1}
              onClick={() => setPage(x => x - 1)}
            />
            <FabButton
              icon={bxChevronRight}
              alt
              disabled={page >= data.length}
              onClick={() => setPage(x => x + 1)}
            />
          </div>
        )}

        <NavLink
          to="/marketplace/signalers"
          className="flex items-center text-xs text-v1-content-link hover:text-v1-content-link-hover"
        >
          {t('common:see-more')}
          <Icon name={bxRightArrowAlt} size={16} />
        </NavLink>
      </div>

      {content}
    </div>
  );
};

export default SectionSignals;
