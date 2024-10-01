import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { setJwtToken } from 'modules/base/auth/jwt-store';

interface SuccessResponse {
  message: 'ok';
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
      const { data } = await axios.post<SuccessResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/auth/verify-email/`,
        body,
        { withCredentials: true },
      );

      await refreshAccessToken();
      await client.invalidateQueries();
      return data.message === 'ok';
    } catch (error) {
      if (!(error instanceof AxiosError) || error.response?.status !== 400)
        throw error;
      return false;
    }
  });
}
