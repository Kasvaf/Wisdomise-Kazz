/// <reference types="vite-plugin-svgr/client" />
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { configApp } from 'config/config';
import { queryClient } from 'config/reactQuery';
import { AppAuthContainer } from 'modules/base/App/AppAuthContainer';

configApp();

// eslint-disable-next-line import/no-named-as-default-member
ReactDOM.createRoot(document.querySelector('#root')!).render(
  <Sentry.ErrorBoundary fallback={<SentryErrorFallback />}>
    <QueryClientProvider client={queryClient}>
      <AppAuthContainer />
    </QueryClientProvider>
  </Sentry.ErrorBoundary>,
);

function SentryErrorFallback() {
  return (
    <div className="flex h-screen w-screen items-center justify-center text-white">
      Error Occurred... Sorry!
    </div>
  );
}
