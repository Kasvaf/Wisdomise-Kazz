import { clsx } from 'clsx';
import type { FC } from 'react';
import { LoadingBadge, useLoadingBadge } from 'shared/LoadingBadge';
import Breadcrumb from './Breadcrumb';
import BtnBackDesktop from './BtnBackDesktop';

const RouteDetails: FC<{
  className?: string;
  hasBack?: boolean;
}> = ({ className, hasBack }) => {
  const showLoadingBadge = useLoadingBadge();

  return (
    <div
      className={clsx(
        'flex flex-nowrap items-center gap-3 overflow-visible bg-v1-surface-l1 px-3',
        'whitespace-nowrap border-white/10 border-y',
        'text-xs empty:hidden',
        className,
      )}
    >
      {hasBack && (
        <>
          <BtnBackDesktop />
          <div className="h-full border-white/10 border-l" />
        </>
      )}
      <Breadcrumb className="!text-xs max-h-full shrink-0 [&_a]:h-auto [&_ol]:flex-nowrap" />
      <LoadingBadge
        animation="fade"
        className="!bg-transparent max-h-full"
        value={showLoadingBadge}
      />
    </div>
  );
};

export default RouteDetails;
