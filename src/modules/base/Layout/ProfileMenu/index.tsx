import { clsx } from 'clsx';
import { bxLogIn } from 'boxicons-quasar';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { isDebugMode, isMiniApp } from 'utils/version';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import useIsMobile from 'utils/useIsMobile';
import { ReactComponent as UserIcon } from './user.svg';
import BtnTelegramProfile from './BtnTelegramProfile';
import ProfileMenuContent from './ProfileMenuContent';

const DebugBadge = () =>
  isDebugMode ? (
    <div className="size-2 bg-v1-background-negative absolute -right-1 -top-1 rounded-full" />
  ) : null;

const ProfileMenu: React.FC<{ className?: string }> = ({ className }) => {
  const isLoggedIn = useIsLoggedIn();
  const isMobile = useIsMobile();
  const [ModalLogin, showModalLogin] = useModalLogin();

  return isLoggedIn ? (
    <ClickableTooltip
      chevron={false}
      title={<ProfileMenuContent />}
      tooltipPlacement="bottomLeft"
      className={className}
    >
      {isMiniApp ? (
        <BtnTelegramProfile />
      ) : (
        <Button
          variant="ghost"
          size={isMobile ? 'md' : 'xs'}
          className={isMobile ? 'w-md' : 'w-xs'}
          surface={1}
        >
          <UserIcon className="size-4 shrink-0" />
          <DebugBadge />
        </Button>
      )}
    </ClickableTooltip>
  ) : (
    <>
      <Button
        variant="primary"
        size={isMobile ? 'md' : 'xs'}
        className={clsx(isMobile ? 'w-md' : 'w-xs', className)}
        onClick={showModalLogin}
        surface={isMobile ? 2 : 3}
      >
        <Icon name={bxLogIn} size={24} />
        <DebugBadge />
      </Button>
      {ModalLogin}
    </>
  );
};

export default ProfileMenu;
