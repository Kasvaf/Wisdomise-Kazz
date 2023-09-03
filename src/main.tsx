import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { QueryClientProvider } from '@tanstack/react-query';
import configApp from 'config/config';
import queryClient from 'config/reactQuery';
import AppAuthContainer from 'modules/base/AppAuthContainer';
import PageError from 'modules/base/PageError';

configApp();

const root = document.querySelector('#root');
if (!root) throw new Error('unexpected');

createRoot(root).render(
  <Sentry.ErrorBoundary fallback={<PageError />}>
    <QueryClientProvider client={queryClient}>
      <AppAuthContainer />
    </QueryClientProvider>
  </Sentry.ErrorBoundary>,
);
