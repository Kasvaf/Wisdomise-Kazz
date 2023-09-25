import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type Account } from './types/UserInfoResponse';
import { type PageResponse } from './types/page';

export function useAccountQuery() {
  return useQuery<Account>(
    ['account'],
    async () => {
      const { data } = await axios.get<Account>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/me`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}
interface UserProfileUpdate {
  nickname: string | null;
  referrer_code: string;
  terms_and_conditions_accepted?: boolean;
  privacy_policy_accepted?: boolean;
}

export const useUserInfoMutation =
  () => async (body: Partial<UserProfileUpdate>) => {
    const { data } = await axios.patch<UserProfileUpdate>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/me`,
      body,
    );
    return data;
  };

export const useResendVerificationEmailMutation = () => async () => {
  const { status } = await axios.post(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/verification_email/`,
  );
  return status >= 200 && status < 400;
};

interface AppDetail {
  key: string;
  name: string;
  frontend_url: string;
}

export function useAppsInfoQuery(appName?: string) {
  return useQuery(
    ['getApp', appName],
    async ({ queryKey }) => {
      const [, name] = queryKey;
      const { data } = await axios.get<PageResponse<AppDetail>>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/apps${
          name ? 'name=' + name : ''
        }`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      retry: false,
    },
  );
}
