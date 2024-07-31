import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import { useEffectOnce } from 'usehooks-ts';
import PageError from 'modules/base/PageError';
import App from 'modules/base/App';
import { RouterBaseName } from 'config/constants';
import queryClient from 'config/reactQuery';
import { useErrorNotification } from 'shared/useErrorNotification';

const root = document.querySelector('#root');
if (!root) throw new Error('unexpected');

if (RouterBaseName) {
  localStorage.setItem('last-branch', RouterBaseName);
}

function Root() {
  const [showError, errorNotificationContent] = useErrorNotification();
  useEffectOnce(() => {
    queryClient.setDefaultOptions({
      mutations: {
        onError(error) {
          showError(error);
          throw error;
        },
      },
    });
  });
  return (
    <Sentry.ErrorBoundary fallback={<PageError />}>
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
          <App />
          {errorNotificationContent}
        </ConfigProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" /> */}
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
}

createRoot(root).render(<Root />);
