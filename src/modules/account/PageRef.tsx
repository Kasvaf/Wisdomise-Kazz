import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { REDIRECT_APP_KEY } from 'modules/auth/constants';
import { REFERRER_CODE_KEY } from './keys';

export default function PageRef() {
  const { referrerCode } = useParams<'referrerCode'>();
  const navigate = useNavigate();

  useEffect(() => {
    if (referrerCode) {
      sessionStorage.setItem(REDIRECT_APP_KEY, 'landing');
      sessionStorage.setItem(REFERRER_CODE_KEY, referrerCode);
      navigate('/');
    }
  }, [navigate, referrerCode]);

  return null;
}
