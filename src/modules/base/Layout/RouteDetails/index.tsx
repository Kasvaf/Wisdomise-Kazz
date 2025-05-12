import { type FC } from 'react';
import { clsx } from 'clsx';
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
        'whitespace-nowrap border-y border-white/10',
        'h-7 text-xs empty:hidden',
        className,
      )}
    >
      {hasBack && (
        <>
          <BtnBackDesktop />
          <div className="h-full border-l border-white/10" />
        </>
      )}
      <Breadcrumb className="max-h-full shrink-0 !text-xs [&_a]:h-auto [&_ol]:flex-nowrap" />
      <LoadingBadge
        value={showLoadingBadge}
        animation="fade"
        className="max-h-full !bg-transparent"
      />
    </div>
  );
};

export default RouteDetails;
