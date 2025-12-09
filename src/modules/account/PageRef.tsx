import { REFERRER_CODE_KEY } from 'modules/base/Container/ReferrerListener';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PageRef() {
  const { referrerCode } = useParams<'referrerCode'>();
  const navigate = useNavigate();

  useEffect(() => {
    if (referrerCode) {
      localStorage.setItem(REFERRER_CODE_KEY, referrerCode);
    }
    navigate('/');
  }, [navigate, referrerCode]);

  return null;
}
