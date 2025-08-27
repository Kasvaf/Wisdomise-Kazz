import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export const REFERRER_CODE_KEY = 'referrer_code';

export default function PageRef() {
  const { referrerCode } = useParams<'referrerCode'>();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (referrerCode) {
      localStorage.setItem(REFERRER_CODE_KEY, referrerCode);
    }
    const nextUrlRaw = searchParams.get('next');
    if (nextUrlRaw) {
      const nextUrl = new URL(nextUrlRaw, window.location.origin);
      if (nextUrl.origin === window.location.origin) {
        navigate(nextUrl.pathname + nextUrl.search);
        return;
      } else if (
        /^https:\/\/([\w-]{1,100}\.|)wisdomise\.com$/.test(nextUrl.origin)
      ) {
        window.location.href = nextUrl.href;
        return;
      }
    }
    navigate('/trench');
  }, [navigate, referrerCode, searchParams]);

  return null;
}
