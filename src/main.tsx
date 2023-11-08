import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageError from 'modules/base/PageError';
import App from 'modules/base/App';
import { RouterBaseName } from 'config/constants';

const root = document.querySelector('#root');
if (!root) throw new Error('unexpected');

if (RouterBaseName) {
  localStorage.setItem('last-branch', RouterBaseName);
}

const queryClient = new QueryClient();
createRoot(root).render(
  <Sentry.ErrorBoundary fallback={<PageError />}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Sentry.ErrorBoundary>,
);
