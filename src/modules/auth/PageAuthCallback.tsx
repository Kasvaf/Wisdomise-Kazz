import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Splash from 'modules/base/Splash';
import { setJwtToken } from './jwt-store';

export const TOKEN_PARAM = 'token';

export default function PageAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get(TOKEN_PARAM);
    if (tokenParam) {
      setJwtToken(tokenParam);
    }
    navigate('/');
  }, [searchParams, navigate]);

  return <Splash />;
}
