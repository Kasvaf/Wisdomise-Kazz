import { clsx } from 'clsx';
import type React from 'react';
import { type PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import useIsMobile from 'utils/useIsMobile';
import { RouterBaseName } from 'config/constants';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import { isMiniApp } from 'utils/version';
import BtnBack from 'modules/base/BtnBack';
import BranchSelector from './BranchSelector';
import LanguageSelector from './LanguageSelector';
import ProfileMenu from './ProfileMenu';
import Breadcrumb from './Breadcrumb';

const Header: React.FC<
  PropsWithChildren<{
    className?: string;
    showSiblings?: boolean;
    onShowSiblings?: React.Dispatch<React.SetStateAction<boolean>>;
  }>
> = ({ showSiblings, onShowSiblings, className, children }) => {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  return (
    <div
      className={clsx(
        'fixed top-0 z-20 mx-auto w-full max-w-[2304px] bg-v1-background-primary',
        className,
      )}
    >
      <div
        className={clsx(
          'flex h-20 items-center gap-3 p-6 pl-[--side-menu-width] mobile:px-4 mobile:py-3',
        )}
      >
        {isMobile ? (
          <div className="flex w-[calc(100vw-2rem)] items-center justify-between">
            {pathname.startsWith('/account') ? (
              <>
                <div className="w-1/2">
                  <BtnBack className="w-1/2" />
                </div>
                <Breadcrumb
                  className="shrink-0"
                  showSiblings={showSiblings}
                  readonly={true}
                />
                <div className="flex w-1/2 justify-end">
                  {/* <BtnLiveSupport /> */}
                </div>
              </>
            ) : (
              <>
                <div className="mr-2 w-1/2">
                  <ProfileMenu className="w-full" />
                </div>

                {/* // weird class hides it when there's a button on right */}
                <div className="shrink-0 has-[+div>*]:hidden">
                  <Breadcrumb
                    showLogo={true}
                    showSiblings={showSiblings}
                    onShowSiblings={onShowSiblings}
                  />
                </div>

                <div
                  className={clsx(
                    'ml-2 flex w-1/2 justify-end',
                    // in mini-app, we want logo on right (more space needed for left)
                    isMiniApp && '[&:not(:has(*))]:hidden',
                  )}
                >
                  {pathname.startsWith('/account') ? null : (
                    <BtnWalletConnect />
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Breadcrumb className="pl-6" />
            <div className="grow" />
            {RouterBaseName && <BranchSelector />}
            <LanguageSelector />
            <BtnWalletConnect />
            <ProfileMenu />
          </>
        )}
      </div>
      {children}
    </div>
  );
};

export default Header;
