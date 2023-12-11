import { clsx } from 'clsx';
import type React from 'react';
import { ATHENA_FE, RouterBaseName } from 'config/constants';
import Logo from 'assets/logo-horizontal-beta.svg';
import BranchSelector from './BranchSelector';
import WalletDropdown from './WalletDropdown';
import ProfileMenu from './ProfileMenu';

interface Props {
  className?: string;
}

const Header: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={clsx('fixed z-20 mx-auto w-full max-w-screen-2xl', className)}
    >
      <div
        className={clsx(
          'flex h-20 items-center justify-end bg-page p-6 mobile:justify-between mobile:px-4 mobile:py-3',
        )}
      >
        <a href={ATHENA_FE} className="hidden mobile:block">
          <img src={Logo} />
        </a>
        {RouterBaseName && <BranchSelector />}
        <div className="mobile:hidden">
          <WalletDropdown />
        </div>
        <ProfileMenu />
      </div>
    </div>
  );
};

export default Header;
