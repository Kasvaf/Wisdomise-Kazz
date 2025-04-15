import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { analytics } from 'config/segment';
import Spinner from 'shared/Spinner';
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
      <React.Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center text-white mobile:h-[calc(100vh-10rem)]">
            <Spinner />
          </div>
        }
      >
        <Outlet />
      </React.Suspense>
    </Sentry.ErrorBoundary>
  );
};

export default Boundary;
