import { bxLogIn } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import useIsMobile from 'utils/useIsMobile';
import { isDebugMode, isMiniApp } from 'utils/version';
import BtnTelegramProfile from './BtnTelegramProfile';
import ProfileMenuContent from './ProfileMenuContent';
import { ReactComponent as UserIcon } from './user.svg';

const DebugBadge = () =>
  isDebugMode ? (
    <div className="-right-1 -top-1 absolute size-2 rounded-full bg-v1-background-negative" />
  ) : null;

const ProfileMenu: React.FC<{ className?: string }> = ({ className }) => {
  const isLoggedIn = useIsLoggedIn();
  const isMobile = useIsMobile();
  const [ModalLogin, showModalLogin] = useModalLogin();

  return isLoggedIn ? (
    <ClickableTooltip
      chevron={false}
      className={className}
      title={<ProfileMenuContent />}
      tooltipPlacement="bottomLeft"
    >
      {isMiniApp ? (
        <BtnTelegramProfile />
      ) : (
        <Button
          className={isMobile ? 'w-md' : 'w-xs'}
          size={isMobile ? 'md' : 'xs'}
          surface={1}
          variant="ghost"
        >
          <UserIcon className="size-4 shrink-0" />
          <DebugBadge />
        </Button>
      )}
    </ClickableTooltip>
  ) : (
    <>
      <Button
        className={clsx(isMobile ? 'w-md' : 'w-xs', className)}
        onClick={showModalLogin}
        size={isMobile ? 'md' : 'xs'}
        surface={isMobile ? 2 : 3}
        variant="primary"
      >
        <Icon name={bxLogIn} size={24} />
        <DebugBadge />
      </Button>
      {ModalLogin}
    </>
  );
};

export default ProfileMenu;
