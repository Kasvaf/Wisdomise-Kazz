import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FetchError } from 'ofetch';
import { useRef } from 'react';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { delJwtToken, setJwtToken } from 'modules/base/auth/jwt-store';
import { gtag } from 'config/gtag';
import { ofetch } from 'config/ofetch';
import { useTelegram } from 'modules/autoTrader/layout/TelegramProvider';
import { isLocal } from 'utils/version';
import { useUserStorage } from './userStorage';

interface SuccessResponse {
  message: 'ok';
}

interface CreationStatusResponse {
  created: boolean;
}

const useSignupAdditionalTasks = () => {
  const userStorage = useUserStorage('signup-url');
  const signupUrl = useRef(location.pathname + location.search);
  return () => {
    gtag('event', 'sign_up');
    return userStorage.save(signupUrl.current);
  };
};

async function _refreshAccessToken() {
  const data = await ofetch<{ access_token: string }>(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/access-token/`,
    { credentials: 'include', body: {}, method: 'post' },
  );
  setJwtToken(data.access_token);
}

let refreshing: Promise<void> | undefined;
export function refreshAccessToken() {
  if (!refreshing) {
    refreshing = _refreshAccessToken();
    void refreshing.finally(() => {
      refreshing = undefined;
    });
  }
  return refreshing;
}

export function useEmailLoginMutation() {
  return useMutation<boolean, unknown, { email: string }>(async body => {
    const data = await ofetch<SuccessResponse>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/email-login/`,
      {
        body,
        method: 'post',
      },
    );
    return data.message === 'ok';
  });
}

export function useVerifyEmailMutation() {
  const client = useQueryClient();
  const runSignupAdditionalTasks = useSignupAdditionalTasks();
  return useMutation<
    boolean,
    unknown,
    { email: string; nonce: string; referrer_code?: string }
  >(async body => {
    try {
      const data = await ofetch<SuccessResponse & CreationStatusResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/verify-email/`,
        {
          body,
          credentials: 'include',
          method: 'post',
        },
      );

      await refreshAccessToken();
      await client.invalidateQueries();
      if (data.created) {
        await runSignupAdditionalTasks();
      }
      return data.message === 'ok';
    } catch (error) {
      if (!(error instanceof FetchError) || error.response?.status !== 400)
        throw error;
      return false;
    }
  });
}

export function useGoogleLoginMutation() {
  const client = useQueryClient();
  const runSignupAdditionalTasks = useSignupAdditionalTasks();
  return useMutation<
    boolean,
    unknown,
    { id_token: string; referrer_code?: string }
  >(async body => {
    try {
      const data = await ofetch<SuccessResponse & CreationStatusResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/google-login/`,
        {
          body,
          credentials: 'include',
          method: 'post',
        },
      );

      await refreshAccessToken();
      await client.invalidateQueries();
      if (data.created) {
        await runSignupAdditionalTasks();
      }
      return data.message === 'ok';
    } catch (error) {
      if (!(error instanceof FetchError) || error.response?.status !== 400)
        throw error;
      return false;
    }
  });
}

export function useMiniAppTgLoginMutation() {
  const { webApp } = useTelegram();
  const q = import.meta.env.VITE_CUSTOM_QUERY as string;
  const query = isLocal ? q : webApp?.initData;

  return useMutation<boolean, unknown, unknown>(async () => {
    const data = await ofetch<SuccessResponse>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/mini-app-login/?${
        query || ''
      }`,
      {
        meta: { auth: false },
        credentials: 'include',
      },
    );

    await refreshAccessToken();

    return data.message === 'ok';
  });
}

export function useMiniAppTgLoginFromWebMutation() {
  return useMutation<boolean, unknown, { uuid: string; referrer?: string }>(
    async ({ uuid, referrer }) => {
      try {
        const data = await ofetch<SuccessResponse>(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/telegram-login/`,
          {
            meta: { auth: false },
            credentials: 'include',
            body: { uuid, referrer_code: referrer },
            method: 'POST',
          },
        );
        await refreshAccessToken();
        return data.message === 'ok';
      } catch {
        return false;
      }
    },
  );
}

export function useMiniAppConnectMutation() {
  const { webApp } = useTelegram();
  const q = import.meta.env.VITE_CUSTOM_QUERY as string;
  const query = isLocal ? q : webApp?.initData;

  return useMutation<boolean, unknown, unknown>(async () => {
    const data = await ofetch<SuccessResponse>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/telegram-connect/?${
        query || ''
      }`,
      {
        method: 'POST',
        meta: { auth: false },
        body: {},
      },
    );

    return data.message === 'ok';
  });
}

export function useMiniAppWebLoginMutation() {
  const { webApp } = useTelegram();
  const q = import.meta.env.VITE_CUSTOM_QUERY as string;
  const query = isLocal ? q : webApp?.initData;

  return useMutation<boolean | 'exists', unknown, { confirm?: boolean }>(
    async ({ confirm }) => {
      if (!query) return false;
      try {
        const data = await ofetch<SuccessResponse>(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/web-login/?${query}`,
          {
            method: 'POST',
            meta: { auth: false },
            credentials: 'include',
            body: { override: confirm || false },
          },
        );

        await refreshAccessToken();
        return data.message === 'ok';
      } catch (error) {
        if (error instanceof FetchError && error.statusCode === 409) {
          return 'exists';
        }
        throw error;
      }
    },
  );
}

export function useLogoutMutation() {
  const client = useQueryClient();
  return useMutation<boolean, unknown, unknown>(async () => {
    const data = await ofetch<SuccessResponse>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/logout/`,
      { credentials: 'include', body: {}, method: 'post' },
    );
    delJwtToken();
    await client.invalidateQueries({});
    return data.message === 'ok';
  });
}
