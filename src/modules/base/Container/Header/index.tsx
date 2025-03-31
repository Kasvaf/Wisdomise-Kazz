import { clsx } from 'clsx';
import type React from 'react';
import { bxsTrophy } from 'boxicons-quasar';
import { type PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isMiniApp } from 'utils/version';
import { useActiveNetwork } from 'modules/base/active-network';
import { Button } from 'shared/v1-components/Button';
import { RouterBaseName } from 'config/constants';
import useIsMobile from 'utils/useIsMobile';
import Icon from 'shared/Icon';
import BtnBack from 'modules/base/BtnBack';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import BranchSelector from './BranchSelector';
import ProfileMenu from './ProfileMenu';
import Breadcrumb from './Breadcrumb';
import { IconTrades } from './ProfileMenu/ProfileMenuContent/icons';

const Header: React.FC<
  PropsWithChildren<{
    className?: string;
  }>
> = ({ className, children }) => {
  const isMobile = useIsMobile();
  const net = useActiveNetwork();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const tradesBtn = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => navigate('/trader-positions')}
        size={isMobile ? 'md' : 'xl'}
        variant="ghost"
        className={clsx(
          '!px-4',
          pathname.startsWith('/trader-positions') && '!text-[#00A3FF]',
        )}
        surface={2}
      >
        <IconTrades />
        Trades
      </Button>

      <Button
        onClick={() => navigate('/trader-quests/tournaments')}
        size={isMobile ? 'md' : 'xl'}
        variant="ghost"
        className={clsx(
          '!px-4',
          pathname.startsWith('/trader-quests/tournaments') &&
            '!text-v1-content-notice',
        )}
        surface={2}
      >
        <Icon name={bxsTrophy} className="text-v1-background-notice" />
        Tournaments
      </Button>
    </div>
  );

  return (
    <div
      className={clsx(
        'fixed top-0 z-20 mx-auto w-full max-w-[2304px] bg-v1-background-primary',
        'border-b border-v1-border-tertiary mobile:border-transparent',
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
            {pathname.startsWith('/account') ||
            pathname.startsWith('/coin/') ? (
              <>
                <div className="w-1/2">
                  <BtnBack className="w-1/2" />
                </div>
                {!pathname.startsWith('/account/rewards') && (
                  <Breadcrumb className="shrink-0" />
                )}
                <div className="flex w-1/2 justify-end">
                  {pathname.startsWith('/account/rewards') && (
                    <BtnWalletConnect />
                  )}
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
                  {net ? <BtnWalletConnect /> : tradesBtn}
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Breadcrumb className="pl-6" />
            <div className="grow" />
            {children && (
              <>
                {children}
                <div className="mx-2 h-full w-px bg-v1-border-tertiary" />
              </>
            )}
            {RouterBaseName && <BranchSelector />}
            {tradesBtn}
            <BtnWalletConnect />
            <ProfileMenu />
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
