import React from 'react';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import PageWrapper from '../PageWrapper';
import PageError from '../PageError';

const Boundary = () => {
  return (
    <React.Suspense fallback={<PageWrapper loading />}>
      <ErrorBoundary fallback={<PageError />}>
        <Outlet />
      </ErrorBoundary>
    </React.Suspense>
  );
};

export default Boundary;
