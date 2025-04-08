import { clsx } from 'clsx';
import type React from 'react';
import { useLocation } from 'react-router-dom';
import { isMiniApp } from 'utils/version';
import { useActiveNetwork } from 'modules/base/active-network';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import BtnBack from 'modules/base/BtnBack';
import Breadcrumb from './DesktopHeader/Breadcrumb';
import TraderButtons from './TraderButtons';
import ProfileMenu from './ProfileMenu';

const MobileHeader: React.FC<{
  hasBack?: boolean;
  hasProfile?: boolean;
  className?: string;
}> = ({ className }) => {
  const net = useActiveNetwork();
  const { pathname } = useLocation();

  return (
    <div
      className={clsx(
        'bg-v1-background-primary',
        'border-b border-v1-border-tertiary mobile:border-transparent',
        'h-20 mobile:h-16',
        className,
      )}
    >
      <div
        className={clsx(
          'flex h-full items-center gap-3 p-6 mobile:px-4 mobile:py-3',
        )}
      >
        <div className="flex w-[calc(100vw-2rem)] items-center justify-between">
          {pathname.startsWith('/account') || pathname.startsWith('/coin/') ? (
            <>
              <div className="w-1/2">
                <BtnBack className="w-1/2" />
              </div>
              <Breadcrumb className="shrink-0" />
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
                <Breadcrumb showLogo />
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
                  <TraderButtons />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
