import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useModalLogin } from 'modules/base/auth/ModalLogin';

const useEnsureAuthenticated = () => {
  const isLoggedIn = useIsLoggedIn();
  const [ModalLogin, showModalLogin] = useModalLogin();
  const ensureAuthenticated = async () => {
    return isLoggedIn || (await showModalLogin());
  };

  return [ModalLogin, ensureAuthenticated] as const;
};

export default useEnsureAuthenticated;
