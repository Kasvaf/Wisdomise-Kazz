import { useHasFlag } from 'api';
import { ReactComponent as Logo } from 'assets/logo-green.svg';
import { bxTrophy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { RouterBaseName } from 'config/constants';
import { IconReferral } from 'modules/base/Layout/ProfileMenu/ProfileMenuContent/icons';
import BtnWalletConnect from 'modules/base/wallet/BtnWalletConnect';
import type React from 'react';
import type { ReactElement } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import BranchSelector from '../BranchSelector';
import HeaderNav from '../HeaderNav';
import ProfileMenu from '../ProfileMenu';

const DesktopHeader: React.FC<{
  extension?: null | false | ReactElement;
  className?: string;
}> = ({ extension, className }) => {
  const hasFlag = useHasFlag();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  return (
    <div className={clsx('h-full bg-v1-background-primary', className)}>
      <div className="flex h-full items-center gap-2 border border-white/10 bg-v1-surface-l0 px-3">
        <div className="relative flex shrink-0 grow flex-nowrap items-center gap-4 overflow-auto whitespace-nowrap md:max-xl:gap-3">
          <NavLink className="pe-4 md:max-xl:pe-3" to="/">
            <Logo className="h-8 w-auto" />
          </NavLink>
        </div>

        {extension && <>{extension}</>}

        {RouterBaseName && <BranchSelector />}

        <HeaderNav />
        <BtnWalletConnect />
        {hasFlag('/account/referral') && (
          <Button
            className={clsx(
              isMobile ? '!px-4' : '!px-2',
              pathname.startsWith('/account/referral') &&
                '!text-v1-content-brand',
            )}
            onClick={() => navigate('/account/referral')}
            size={isMobile ? 'md' : 'xs'}
            surface={1}
            variant="ghost"
          >
            <IconReferral />
            Referral Program
          </Button>
        )}
        {hasFlag('/trader/quests/league') && (
          <Button
            className={clsx(
              isMobile ? '!px-4' : '!px-2',
              pathname.startsWith('/trader/quests/league') &&
                '!text-v1-content-brand',
            )}
            onClick={() => navigate('/trader/quests/league')}
            size={isMobile ? 'md' : 'xs'}
            surface={1}
            variant="ghost"
          >
            <Icon className="[&>svg]:!size-4" name={bxTrophy} />
            League
          </Button>
        )}
        <ProfileMenu />
      </div>
    </div>
  );
};

export default DesktopHeader;
