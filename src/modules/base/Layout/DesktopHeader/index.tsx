import { type ReactElement } from 'react';
/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import type React from 'react';
import { RouterBaseName } from 'config/constants';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import { LoadingBadge, useLoadingBadge } from 'shared/LoadingBadge';
import ProfileMenu from '../ProfileMenu';
import BranchSelector from '../BranchSelector';
import TraderButtons from '../TraderButtons';
import Breadcrumb from './Breadcrumb';

const DesktopHeader: React.FC<{
  hasBack?: boolean;
  extension?: null | false | ReactElement;
  className?: string;
}> = ({ className, extension }) => {
  const showLoadingBadge = useLoadingBadge();

  return (
    <div
      className={clsx(
        'bg-v1-background-primary',
        'border-b border-v1-border-tertiary mobile:border-transparent',
        'h-20 mobile:h-16',
        className,
      )}
    >
      <div
        className={clsx(
          'flex h-full items-center gap-3 p-6 mobile:px-4 mobile:py-3',
        )}
      >
        <div className="relative flex grow flex-nowrap items-center gap-4 overflow-auto whitespace-nowrap pl-6">
          <Breadcrumb className="shrink-0 truncate [&_ol]:flex-nowrap" />
          <LoadingBadge value={showLoadingBadge} animation="fade" />
        </div>

        {extension && (
          <>
            {extension}
            <div className="mx-2 h-full w-px bg-v1-border-tertiary" />
          </>
        )}

        {RouterBaseName && <BranchSelector />}

        <TraderButtons />
        <BtnWalletConnect />
        <ProfileMenu />
      </div>
    </div>
  );
};

export default DesktopHeader;
