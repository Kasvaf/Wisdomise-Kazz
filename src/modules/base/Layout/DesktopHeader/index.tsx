import { type ReactElement } from 'react';
/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import type React from 'react';
import { RouterBaseName } from 'config/constants';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import { LoadingBadge, useLoadingBadge } from 'shared/LoadingBadge';
import { ReactComponent as Logo } from 'assets/WisdomiseLogo.svg';
import ProfileMenu from '../ProfileMenu';
import BranchSelector from '../BranchSelector';
import TraderButtons from '../TraderButtons';
import MenuItems from '../MenuItems';
import Breadcrumb from './Breadcrumb';
import BtnBackDesktop from './BtnBackDesktop';

const DesktopHeader: React.FC<{
  hasBack?: boolean;
  extension?: null | false | ReactElement;
  className?: string;
}> = ({ hasBack, extension, className }) => {
  const showLoadingBadge = useLoadingBadge();

  return (
    <div className={clsx('bg-v1-background-primary', className)}>
      <div className="flex h-12 items-center gap-3 bg-v1-surface-l2 px-6 py-2">
        <div className="relative flex grow flex-nowrap items-center gap-4 overflow-auto whitespace-nowrap">
          <Logo />
          <div className="ml-4 border-l border-white/10 pl-4">
            <MenuItems horizontal className="gap-8" />
          </div>
        </div>

        {extension && (
          <>
            {extension}
            <div className="h-full w-px bg-v1-border-tertiary" />
          </>
        )}

        {RouterBaseName && <BranchSelector />}

        <TraderButtons />
        <BtnWalletConnect />
        <ProfileMenu />
      </div>

      <div
        className={clsx(
          'relative flex flex-nowrap items-center gap-3 overflow-auto px-6 py-1.5',
          'whitespace-nowrap border-y border-v1-border-tertiary',
          'h-7 text-xs',
        )}
      >
        {hasBack && (
          <>
            <BtnBackDesktop />
            <div className="h-full border-l border-white/10" />
          </>
        )}
        <Breadcrumb className="max-h-full shrink-0 truncate !text-xs [&_a]:h-auto [&_ol]:flex-nowrap" />
        <LoadingBadge
          value={showLoadingBadge}
          animation="fade"
          className="max-h-full !bg-transparent"
        />
      </div>
    </div>
  );
};

export default DesktopHeader;
