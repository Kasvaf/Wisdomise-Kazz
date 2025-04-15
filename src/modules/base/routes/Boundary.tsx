import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { analytics } from 'config/segment';
import PageError from '../PageError';
import Splash from '../Splash';

const Boundary = () => {
  const location = useLocation();
  useEffect(() => {
    void analytics.pageView(location.pathname + location.search);
  }, [location]);

  return (
    <Sentry.ErrorBoundary
      fallback={x => <PageError errorObject={x} level="router" />}
    >
      <React.Suspense fallback={<Splash />}>
        <Outlet />
      </React.Suspense>
    </Sentry.ErrorBoundary>
  );
};

export default Boundary;
