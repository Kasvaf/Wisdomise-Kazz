import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { REDIRECT_APP_KEY, REFERRER_CODE_KEY } from 'modules/auth/constants';

export default function PageRef() {
  const { referrerCode } = useParams<'referrerCode'>();
  const navigate = useNavigate();

  useEffect(() => {
    if (referrerCode) {
      sessionStorage.setItem(REDIRECT_APP_KEY, 'landing');
      localStorage.setItem(REFERRER_CODE_KEY, referrerCode);
      navigate('/');
    }
  }, [navigate, referrerCode]);

  return null;
}
