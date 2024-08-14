import { clsx } from 'clsx';
import type React from 'react';
import { type PropsWithChildren } from 'react';
import { RouterBaseName } from 'config/constants';
import useIsMobile from 'utils/useIsMobile';
import BranchSelector from './BranchSelector';
import LanguageSelector from './LanguageSelector';
import WalletDropdown from './WalletDropdown';
import ProfileMenu from './ProfileMenu';
import Breadcrumb from './Breadcrumb';
import OnBoardingMessageButton from './OnBoardingMessageButton';

const Header: React.FC<
  PropsWithChildren<{
    className?: string;
    showSiblings?: boolean;
    onShowSiblings?: React.Dispatch<React.SetStateAction<boolean>>;
  }>
> = ({ showSiblings, onShowSiblings, className, children }) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={clsx(
        'fixed top-0 z-20 mx-auto w-full max-w-[2304px] bg-page',
        className,
      )}
    >
      <div
        className={clsx(
          'flex h-20 items-center p-6 pl-[--side-menu-width] mobile:px-4 mobile:py-3',
        )}
      >
        {isMobile ? (
          <>
            <Breadcrumb
              showSiblings={showSiblings}
              onShowSiblings={onShowSiblings}
            />
            <div className="grow" />
            {RouterBaseName && <BranchSelector />}
            <OnBoardingMessageButton />
          </>
        ) : (
          <>
            <Breadcrumb className="pl-6" />
            <div className="grow" />
            {RouterBaseName && <BranchSelector />}
            <OnBoardingMessageButton />
            <LanguageSelector />
            <WalletDropdown />
          </>
        )}
        <ProfileMenu />
      </div>
      {children}
    </div>
  );
};

export default Header;
