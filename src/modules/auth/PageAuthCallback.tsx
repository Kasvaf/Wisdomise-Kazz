import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Splash from 'modules/base/Splash';
import { JWT_TOKEN_KEY } from './constants';

export const TOKEN_PARAM = 'token';

export default function PageAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get(TOKEN_PARAM);
    if (tokenParam) {
      localStorage.setItem(JWT_TOKEN_KEY, JSON.stringify(tokenParam));
    }
    navigate('/');
  }, [searchParams, navigate]);

  return <Splash />;
}
