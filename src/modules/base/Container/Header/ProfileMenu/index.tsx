import { bxLogIn } from 'boxicons-quasar';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { isDebugMode } from 'utils/version';
import { ReactComponent as UserIcon } from './user.svg';
import { ProfileMenuTooltip } from './ProfileMenuDesktop';

const DebugBadge = () =>
  isDebugMode ? (
    <div className="absolute -right-1 -top-1 size-2 rounded-full bg-v1-background-negative" />
  ) : null;

const ProfileMenu = () => {
  const isLoggedIn = useIsLoggedIn();
  const [ModalLogin, showModalLogin] = useModalLogin();

  return isLoggedIn ? (
    <ProfileMenuTooltip>
      <Button variant="ghost" size="xl" className="w-xl" surface={1}>
        <UserIcon className="shrink-0" />
        <DebugBadge />
      </Button>
    </ProfileMenuTooltip>
  ) : (
    <>
      <Button
        variant="ghost"
        size="xl"
        className="w-xl"
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
