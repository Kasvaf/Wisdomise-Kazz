import { type ReactElement } from 'react';
/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import type React from 'react';
import { NavLink } from 'react-router-dom';
import { RouterBaseName } from 'config/constants';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import { ReactComponent as Logo } from 'assets/logo-white.svg';
import ProfileMenu from '../ProfileMenu';
import BranchSelector from '../BranchSelector';
import HeaderNav from '../HeaderNav';

const DesktopHeader: React.FC<{
  extension?: null | false | ReactElement;
  className?: string;
}> = ({ extension, className }) => {
  return (
    <div className={clsx('bg-v1-background-primary h-full', className)}>
      <div className="bg-v1-surface-l0 flex h-full items-center gap-2 border border-white/10 px-3">
        <div className="relative flex shrink-0 grow flex-nowrap items-center gap-4 overflow-auto whitespace-nowrap tablet:gap-3">
          <NavLink to="/discovery" className="pe-4 tablet:pe-3">
            <Logo className="h-10 w-auto" />
          </NavLink>
        </div>

        {extension && <>{extension}</>}

        {RouterBaseName && <BranchSelector />}

        <HeaderNav />
        <BtnWalletConnect />
        <ProfileMenu />
      </div>
    </div>
  );
};

export default DesktopHeader;
