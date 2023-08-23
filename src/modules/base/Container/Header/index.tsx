import { clsx } from 'clsx';
import type React from 'react';
import logoSrc from '../icons/logo.svg';
import WalletDropdown from '../WalletDropdown';
import UserDropdown from '../UserDropdown';

interface Props {
  showShadow?: boolean;
}

const Header: React.FC<Props> = ({ showShadow }) => {
  return (
    <div
      className={clsx(
        'fixed top-0 z-[1] mx-auto flex h-20 w-full max-w-screen-2xl items-center justify-end bg-[#131822] p-6 mobile:justify-between mobile:px-4 mobile:py-3',
        showShadow && 'shadow-[0_0_28px_4px_#131822]',
      )}
    >
      <div className="mobile:hidden">
        <WalletDropdown />
      </div>
      <img src={logoSrc} className="hidden mobile:block" />
      <UserDropdown />
    </div>
  );
};

export default Header;
