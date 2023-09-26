import { clsx } from 'clsx';
import type React from 'react';
import { ATHENA_FE, RouterBaseName } from 'config/constants';
import Logo from 'assets/logo-horizontal-beta.svg';
import BranchSelector from './BranchSelector';
import WalletDropdown from './WalletDropdown';
import UserDropdown from './UserDropdown';

interface Props {
  showShadow?: boolean;
  className?: string;
}

const Header: React.FC<Props> = ({ showShadow, className }) => {
  return (
    <div
      className={clsx('fixed z-[1] mx-auto w-full max-w-screen-2xl', className)}
    >
      <div
        className={clsx(
          'flex h-20 items-center justify-end bg-[#131822] p-6 mobile:justify-between mobile:px-4 mobile:py-3',
          showShadow && 'shadow-[0_0_28px_4px_#131822]',
        )}
      >
        <a href={ATHENA_FE} className="hidden mobile:block">
          <img src={Logo} />
        </a>
        {RouterBaseName && <BranchSelector />}
        <div className="mobile:hidden">
          <WalletDropdown />
        </div>
        <UserDropdown />
      </div>
    </div>
  );
};

export default Header;
