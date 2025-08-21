// eslint-disable-next-line unicorn/prefer-node-protocol

import * as Sentry from '@sentry/react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { useEffectOnce } from 'usehooks-ts';
// eslint-disable-next-line import/no-unassigned-import
import 'utils/polyfills';
import { RouterBaseName } from 'config/constants';
import { persisterOptions, queryClient } from 'config/reactQuery';
import App from 'modules/base/App';
import { useJwtEmail } from 'modules/base/auth/jwt-store';
import { UserSettingsProvider } from 'modules/base/auth/UserSettingsProvider';
import CustomTourProvider from 'modules/base/CustomTourProvider';
import PageError from 'modules/base/PageError';
import { LoadingBadgeProvider } from 'shared/LoadingBadge';
import { useErrorNotification } from 'shared/useErrorNotification';
import { ComponentsProvider } from 'shared/v1-components/ComponentsProvider';

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
        },
      },
    });
  });

  const jwtEmail = useJwtEmail();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    void queryClient.invalidateQueries();
  }, [jwtEmail]);

  return (
    <Sentry.ErrorBoundary
      fallback={x => <PageError errorObject={x} level="root" />}
    >
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={persisterOptions}
      >
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
          <ComponentsProvider>
            <HelmetProvider context={{}}>
              <LoadingBadgeProvider>
                <CustomTourProvider>
                  <UserSettingsProvider>
                    <App />
                  </UserSettingsProvider>
                </CustomTourProvider>
              </LoadingBadgeProvider>
            </HelmetProvider>
          </ComponentsProvider>
          {errorNotificationContent}
        </ConfigProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" /> */}
      </PersistQueryClientProvider>
    </Sentry.ErrorBoundary>
  );
}

createRoot(root).render(<Root />);
