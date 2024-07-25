import { Navigate, useLocation } from 'react-router-dom';

export default function PageSocialRadarRedirect() {
  const loc = useLocation();
  return (
    <Navigate
      replace
      to={{
        ...loc,
        pathname: loc.pathname.replace('social-radar', 'coin-radar'),
      }}
    />
  );
}
