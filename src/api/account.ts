import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type UserInfoResponse } from './types/UserInfoResponse';
import { type PageResponse } from './types/page';

export const useUserInfoQuery = () =>
  useQuery<UserInfoResponse>(['user'], async () => {
    const { data } = await axios.get('/account/investors/me');
    return data;
  });

export const useAgreeToTermsMutation = () =>
  useMutation<
    unknown,
    any,
    {
      nickname: string;
      terms_and_conditions_accepted: boolean;
      privacy_policy_accepted: boolean;
      cryptocurrency_risk_disclosure_accepted: boolean;
      referral_code?: string;
    }
  >(body => axios.patch('/account/customers/me', body));

export const useResendVerificationEmailMutation = () =>
  useMutation<unknown, any>(body =>
    axios.post('/account/customers/me/verification-email', body),
  );

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
