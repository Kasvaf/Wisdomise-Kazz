import { useEffect, type PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from 'modules/auth/authHandlers';
import { JWT_TOKEN_KEY } from 'modules/auth/constants';
import { useUserInfoQuery } from 'api';
import Splash from 'modules/base/Splash';

export default function AuthGuard({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const userInfo = useUserInfoQuery();
  const user = userInfo.data?.account;

  useEffect(() => {
    if (!user) return;
    if (!user.info.email_verified) {
      navigate('/auth/verify-email');
    } else if (user.register_status === 'PRIMARY') {
      navigate('/auth/secondary-signup');
    }
  }, [user, navigate]);

  if (!localStorage.getItem(JWT_TOKEN_KEY)) {
    login();
    return null;
  }

  return userInfo.isLoading ? <Splash /> : <>{children}</>;
}
