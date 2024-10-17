import { Navigate, useLocation } from 'react-router-dom';

export default function PageCoinDetailRedirect() {
  const loc = useLocation();
  return (
    <Navigate
      replace
      to={{
        ...loc,
        pathname: loc.pathname.replace('insight/coin-radar', 'coin'),
      }}
    />
  );
}
