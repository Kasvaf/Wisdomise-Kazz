import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { analytics } from 'config/segment';
import PageWrapper from '../PageWrapper';
import PageError from '../PageError';

const Boundary = () => {
  const location = useLocation();
  useEffect(() => {
    void analytics.pageView(location.pathname + location.search);
  }, [location]);

  return (
    <React.Suspense fallback={<PageWrapper loading />}>
      <ErrorBoundary fallback={<PageError />}>
        <Outlet />
      </ErrorBoundary>
    </React.Suspense>
  );
};

export default Boundary;
