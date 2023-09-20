import { useEffect, type PropsWithChildren, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from 'modules/auth/authHandlers';
import { JWT_TOKEN_KEY } from 'modules/auth/constants';
import { useUserInfoQuery } from 'api';
import Splash from 'modules/base/Splash';

export default function AuthGuard({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userInfo = useUserInfoQuery();
  const user = userInfo.data?.account;

  useEffect(() => {
    if (!user || !loading) return;
    if (!user.info.email_verified) {
      navigate('/auth/verify-email');
    } else if (user.register_status === 'PRIMARY') {
      navigate('/auth/secondary-signup');
    } else {
      setLoading(false);
    }
  }, [loading, user, navigate]);

  if (!localStorage.getItem(JWT_TOKEN_KEY)) {
    login();
  }

  return loading ? <Splash /> : <>{children}</>;
}
