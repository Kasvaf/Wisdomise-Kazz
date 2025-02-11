import { clsx } from 'clsx';
import { bxLogIn } from 'boxicons-quasar';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { isDebugMode, isMiniApp } from 'utils/version';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { ReactComponent as UserIcon } from './user.svg';
import ProfileMenuContent from './ProfileMenuContent';
import BtnTelegramProfile from './BtnTelegramProfile';

const DebugBadge = () =>
  isDebugMode ? (
    <div className="absolute -right-1 -top-1 size-2 rounded-full bg-v1-background-negative" />
  ) : null;

const ProfileMenu: React.FC<{ className?: string }> = ({ className }) => {
  const isLoggedIn = useIsLoggedIn();
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
        <Button variant="ghost" size="xl" className="w-xl" surface={1}>
          <UserIcon className="shrink-0" />
          <DebugBadge />
        </Button>
      )}
    </ClickableTooltip>
  ) : (
    <>
      <Button
        variant="primary"
        size="xl"
        className={clsx('w-xl', className)}
        onClick={showModalLogin}
        surface={1}
      >
        <Icon name={bxLogIn} size={24} />
        <DebugBadge />
      </Button>
      {ModalLogin}
    </>
  );
};

export default ProfileMenu;
