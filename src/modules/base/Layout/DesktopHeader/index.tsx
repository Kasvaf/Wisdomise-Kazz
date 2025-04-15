import { type ReactElement } from 'react';
/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import type React from 'react';
import { NavLink } from 'react-router-dom';
import { RouterBaseName } from 'config/constants';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import { LoadingBadge, useLoadingBadge } from 'shared/LoadingBadge';
import { ReactComponent as Logo } from 'assets/WisdomiseLogo.svg';
import { ReactComponent as LogoIcon } from 'assets/logo.svg';
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
      <div className="flex h-12 items-center gap-3 bg-v1-surface-l2 px-3">
        <div className="relative flex grow flex-nowrap items-center gap-4 overflow-auto whitespace-nowrap tablet:gap-3">
          <NavLink
            to="/coin-radar/overview"
            className="border-e border-white/10 pe-4 tablet:pe-3"
          >
            <Logo className="tablet:hidden" />
            <LogoIcon className="hidden tablet:block" />
          </NavLink>
          <div className="h-8 w-px bg-white/10" />
          <div className="-ml-4 flex h-12 items-stretch">
            <MenuItems horizontal itemsClassName="px-4" />
          </div>
        </div>

        {extension && (
          <>
            {extension}
            <div className="h-full w-px bg-white/10" />
          </>
        )}

        {RouterBaseName && <BranchSelector />}

        <TraderButtons />
        <BtnWalletConnect />
        <ProfileMenu />
      </div>

      <div
        className={clsx(
          'relative flex flex-nowrap items-center gap-3 overflow-visible px-3',
          'whitespace-nowrap border-y border-white/10',
          'h-7 text-xs empty:hidden',
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
    </div>
  );
};

export default DesktopHeader;
