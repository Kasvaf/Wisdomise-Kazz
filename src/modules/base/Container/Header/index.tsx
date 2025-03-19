import { clsx } from 'clsx';
import type React from 'react';
import { type PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isMiniApp } from 'utils/version';
import { useActiveNetwork } from 'modules/base/active-network';
import { Button } from 'shared/v1-components/Button';
import { RouterBaseName } from 'config/constants';
import useIsMobile from 'utils/useIsMobile';
import BtnBack from 'modules/base/BtnBack';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import BranchSelector from './BranchSelector';
import ProfileMenu from './ProfileMenu';
import Breadcrumb from './Breadcrumb';
import { IconTrades } from './ProfileMenu/ProfileMenuContent/icons';

const Header: React.FC<
  PropsWithChildren<{
    className?: string;
    showSiblings?: boolean;
    onShowSiblings?: React.Dispatch<React.SetStateAction<boolean>>;
  }>
> = ({ showSiblings, onShowSiblings, className, children }) => {
  const isMobile = useIsMobile();
  const net = useActiveNetwork();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const tradesBtn = (
    <Button
      onClick={() => navigate('/trader-positions')}
      variant={pathname.startsWith('/trader-positions') ? 'outline' : 'ghost'}
      size={isMobile ? 'md' : 'xl'}
      className="!px-4"
      surface={2}
    >
      <IconTrades />
      Trades
    </Button>
  );

  return (
    <div
      className={clsx(
        'fixed top-0 z-20 mx-auto w-full max-w-[2304px] bg-v1-background-primary',
        'h-20 mobile:h-16',
        className,
      )}
    >
      <div
        className={clsx(
          'flex h-full items-center gap-3 p-6 pl-[--side-menu-width] mobile:px-4 mobile:py-3',
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
                  {pathname.startsWith('/account') ? null : net ? (
                    <BtnWalletConnect />
                  ) : (
                    tradesBtn
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
            {tradesBtn}
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
