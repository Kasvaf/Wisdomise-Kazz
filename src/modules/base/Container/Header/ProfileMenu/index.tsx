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
    <div className="absolute -right-1 -top-1 size-2 rounded-full bg-v1-background-negative" />
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
          size={isMobile ? 'md' : 'xl'}
          className={isMobile ? 'w-md' : 'w-xl'}
          surface={2}
        >
          <UserIcon className="shrink-0" />
          <DebugBadge />
        </Button>
      )}
    </ClickableTooltip>
  ) : (
    <>
      <Button
        variant="primary"
        size={isMobile ? 'md' : 'xl'}
        className={clsx(isMobile ? 'w-md' : 'w-xl', className)}
        onClick={showModalLogin}
        surface={2}
      >
        <Icon name={bxLogIn} size={24} />
        <DebugBadge />
      </Button>
      {ModalLogin}
    </>
  );
};

export default ProfileMenu;
