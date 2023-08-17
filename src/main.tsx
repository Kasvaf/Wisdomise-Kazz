/// <reference types="vite-plugin-svgr/client" />
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { QueryClientProvider } from '@tanstack/react-query';
import * as ReactRedux from 'react-redux';
import { configApp } from 'config/config';
import { queryClient } from 'config/reactQuery';
import { AppAuthContainer } from 'modules/base/App/AppAuthContainer';
import store from './store/store';

configApp();

// eslint-disable-next-line import/no-named-as-default-member
ReactDOM.createRoot(document.querySelector('#root')!).render(
  <Sentry.ErrorBoundary fallback={<SentryErrorFallback />}>
    <QueryClientProvider client={queryClient}>
      <ReactRedux.Provider store={store}>
        <AppAuthContainer />
      </ReactRedux.Provider>
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
