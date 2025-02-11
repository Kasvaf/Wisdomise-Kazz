import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import { useEffectOnce } from 'usehooks-ts';
import { useErrorNotification } from 'shared/useErrorNotification';
import { useJwtEmail } from 'modules/base/auth/jwt-store';
import PageError from 'modules/base/PageError';
import App from 'modules/base/App';
import queryClient from 'config/reactQuery';
import { RouterBaseName } from 'config/constants';

const root = document.querySelector('#root');
if (!root) throw new Error('unexpected');

if (RouterBaseName) {
  localStorage.setItem('last-branch', RouterBaseName);
}

function Root() {
  const [showError, errorNotificationContent] = useErrorNotification();
  useEffectOnce(() => {
    queryClient.setDefaultOptions({
      queries: {
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError(error) {
          showError(error);
          throw error;
        },
      },
    });
  });

  const jwtEmail = useJwtEmail();
  useEffect(() => {
    void queryClient.invalidateQueries();
  }, [jwtEmail]);

  return (
    <Sentry.ErrorBoundary
      fallback={x => <PageError errorObject={x} level="root" />}
    >
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              fontFamily:
                '"Poppins", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, ' +
                'Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, ' +
                '"Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", ' +
                '"Noto Color Emoji"',
            },
          }}
        >
          <HelmetProvider context={{}}>
            <App />
          </HelmetProvider>
          {errorNotificationContent}
        </ConfigProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" /> */}
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
}

createRoot(root).render(<Root />);
