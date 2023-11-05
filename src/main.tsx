import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import PageError from 'modules/base/PageError';
import App from 'modules/base/App';
import { RouterBaseName } from 'config/constants';
import queryClient from 'config/reactQuery';

const root = document.querySelector('#root');
if (!root) throw new Error('unexpected');

if (RouterBaseName) {
  localStorage.setItem('last-branch', RouterBaseName);
}

createRoot(root).render(
  <Sentry.ErrorBoundary fallback={<PageError />}>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  </Sentry.ErrorBoundary>,
);
