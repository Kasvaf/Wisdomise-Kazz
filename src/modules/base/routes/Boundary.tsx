import * as Sentry from '@sentry/react';
import { analytics } from 'config/segment';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageError from '../PageError';

const Boundary = () => {
  const location = useLocation();
  useEffect(() => {
    void analytics.pageView(location.pathname + location.search);
  }, [location]);

  return (
    <Sentry.ErrorBoundary
      fallback={x => <PageError errorObject={x} level="router" />}
    >
      <Outlet />
    </Sentry.ErrorBoundary>
  );
};

export default Boundary;
