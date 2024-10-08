import { bxLogIn } from 'boxicons-quasar';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';
import Icon from 'shared/Icon';
import DropButton from '../DropButton';
import ProfileMenuDesktop from './ProfileMenuDesktop';

const ProfileMenu = () => {
  const isLoggedIn = useIsLoggedIn();
  const [ModalLogin, showModalLogin] = useModalLogin();

  return isLoggedIn ? (
    <ProfileMenuDesktop />
  ) : (
    <DropButton className="!text-success" onClick={showModalLogin}>
      {ModalLogin}
      <Icon name={bxLogIn} />
    </DropButton>
  );
};

export default ProfileMenu;
