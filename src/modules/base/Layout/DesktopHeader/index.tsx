import { type ReactElement } from 'react';
/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import type React from 'react';
import { NavLink } from 'react-router-dom';
import { RouterBaseName } from 'config/constants';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import { ReactComponent as Logo } from 'assets/WisdomiseLogo.svg';
import ProfileMenu from '../ProfileMenu';
import BranchSelector from '../BranchSelector';
import TraderButtons from '../TraderButtons';

const DesktopHeader: React.FC<{
  extension?: null | false | ReactElement;
  className?: string;
}> = ({ extension, className }) => {
  return (
    <div className={clsx('h-full bg-v1-background-primary', className)}>
      <div className="flex h-full items-center gap-2 bg-v1-surface-l2 px-3">
        <div className="relative flex shrink-0 grow flex-nowrap items-center gap-4 overflow-auto whitespace-nowrap tablet:gap-3">
          <NavLink to="/discovery" className="pe-4 tablet:pe-3">
            <Logo />
          </NavLink>
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
    </div>
  );
};

export default DesktopHeader;
