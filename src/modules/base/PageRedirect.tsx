import { useMemo } from 'react';
import { Navigate, type Path, useLocation } from 'react-router-dom';

export default function PageRedirect() {
  const from = useLocation();

  const to = useMemo<Partial<Path>>(() => {
    const initialParams = (from.pathname ?? '/').split('/').filter(x => !!x);
    let params = [...initialParams];
    if (params.length === 0) {
      params = ['coin-radar', 'overview'];
    }

    if (params[0] === 'insight') {
      params[0] = 'coin-radar';
    }
    if (params[1] === 'coin-radar') {
      params[1] = 'social-radar';
    }
    if (params[1] === 'market-pulse') {
      params[1] = 'technical-radar';
    }
    if (params[1] === 'whales') {
      params[1] = 'whale-radar';
    }
    if (
      params[0] === 'coin-radar' &&
      params[1] === 'social-radar' &&
      !!params[2]
    ) {
      params = ['coin', params[2]];
    }

    if (params.length === 0 || params.join('/') === initialParams.join('/')) {
      params = ['coin-radar', 'overview'];
    }

    return {
      ...from,
      pathname: `/${params.join('/')}`.replace(/\/{2,}/, '/'),
    };
  }, [from]);

  return <Navigate replace to={to} />;
}
