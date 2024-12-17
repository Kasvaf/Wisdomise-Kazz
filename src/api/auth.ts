import axios, { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { delJwtToken, setJwtToken } from 'modules/base/auth/jwt-store';
import { gtag } from 'config/gtag';

interface SuccessResponse {
  message: 'ok';
}

interface CreationStatusResponse {
  created: boolean;
}

function sendAnalyticsSignUpEvent() {
  gtag('event', 'sign_up');
}

async function _refreshAccessToken() {
  const { data } = await axios.post<{ access_token: string }>(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/access-token/`,
    {},
    { withCredentials: true },
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
    const { data } = await axios.post<SuccessResponse>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/email-login/`,
      body,
    );
    return data.message === 'ok';
  });
}

export function useVerifyEmailMutation() {
  const client = useQueryClient();
  return useMutation<
    boolean,
    unknown,
    { email: string; nonce: string; referrer_code?: string }
  >(async body => {
    try {
      const { data } = await axios.post<
        SuccessResponse & CreationStatusResponse
      >(`${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/verify-email/`, body, {
        withCredentials: true,
      });

      await refreshAccessToken();
      await client.invalidateQueries();
      if (data.created) sendAnalyticsSignUpEvent();
      return data.message === 'ok';
    } catch (error) {
      if (!(error instanceof AxiosError) || error.response?.status !== 400)
        throw error;
      return false;
    }
  });
}

export function useGoogleLoginMutation() {
  const client = useQueryClient();
  return useMutation<
    boolean,
    unknown,
    { id_token: string; referrer_code?: string }
  >(async body => {
    try {
      const { data } = await axios.post<
        SuccessResponse & CreationStatusResponse
      >(`${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/google-login/`, body, {
        withCredentials: true,
      });

      await refreshAccessToken();
      await client.invalidateQueries();
      if (data.created) sendAnalyticsSignUpEvent();
      return data.message === 'ok';
    } catch (error) {
      if (!(error instanceof AxiosError) || error.response?.status !== 400)
        throw error;
      return false;
    }
  });
}

export function useMiniAppLoginQuery(query?: string) {
  return useQuery(
    ['miniAppLogin', query],
    async () => {
      const { data } = await axios.get<SuccessResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/mini-app-login/?${
          query || ''
        }`,
        {
          meta: { auth: false },
          withCredentials: true,
        },
      );

      await refreshAccessToken();
      return data.message === 'ok';
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      enabled: !!query,
    },
  );
}

export function useLogoutMutation() {
  const client = useQueryClient();
  return useMutation<boolean, unknown, unknown>(async () => {
    const { data } = await axios.post<SuccessResponse>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/logout/`,
      {},
      { withCredentials: true },
    );
    delJwtToken();
    await client.invalidateQueries({});
    return data.message === 'ok';
  });
}
