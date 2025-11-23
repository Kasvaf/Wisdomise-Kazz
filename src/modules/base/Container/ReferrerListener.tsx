import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const REFERRER_CODE_KEY = 'referrer_code';

export default function ReferrerListener() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const referrerCode = searchParams.get(REFERRER_CODE_KEY);
    if (referrerCode) {
      localStorage.setItem(REFERRER_CODE_KEY, referrerCode);

      const newParams = new URLSearchParams(searchParams);
      newParams.delete(REFERRER_CODE_KEY);

      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams]);

  return null;
}
