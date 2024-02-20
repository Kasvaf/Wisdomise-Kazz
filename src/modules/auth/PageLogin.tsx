import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Splash from 'modules/base/Splash';
import { login } from './authHandlers';

export default function PageLogin() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    login(searchParams.toString());
  }, [searchParams]);

  return <Splash />;
}
