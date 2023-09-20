import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { logout } from './authHandlers';

export default function PageLogout() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    logout(searchParams.toString());
  }, [searchParams]);

  return null;
}
