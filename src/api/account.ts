import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type Account } from './types/UserInfoResponse';

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
  country: string | null;
  referrer_code: string;
  terms_and_conditions_accepted?: boolean;
  privacy_policy_accepted?: boolean;
}

export const useUserInfoMutation = () => {
  const queryClient = useQueryClient();
  return async (body: Partial<UserProfileUpdate>) => {
    const { data } = await axios.patch<UserProfileUpdate>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/me`,
      body,
    );
    await queryClient.invalidateQueries(['account']);
    return data;
  };
};

export const useResendVerificationEmailMutation = () => async () => {
  const { status } = await axios.post(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/verification_email/`,
  );
  return status >= 200 && status < 400;
};

export interface ReferralStatus {
  referral_code: string;
  referrer?: string;
  referred_users_count: number;
  active_referred_users_count: number;
  interval_days: number;
  interval_referred_users_count: number;
  interval_active_referred_users_count: number;
  wisdomise_referral_revenue: number;
  interval_wisdomise_referral_revenue: number;
  referral_revenue: number;
  interval_referral_revenue: number;
}

export function useReferralStatusQuery(intervalDays?: number) {
  return useQuery(
    ['getReferralStatus', intervalDays],
    async ({ queryKey }) => {
      const [, intervalDays] = queryKey;
      const { data } = await axios.get<ReferralStatus>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/referral-status${
          intervalDays ? '?interval_days=' + String(intervalDays) : ''
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

export interface SetupIntentResponse {
  client_secret: string;
}

export function useStripeSetupIntentQuery() {
  return useQuery(
    ['getStripeSetupIntent'],
    async () => {
      const { data } = await axios.get<SetupIntentResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/stripe/setup-intent`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}

export const useDailyMagicStatusMutation = () => {
  const client = useQueryClient();
  return useMutation<unknown, unknown, boolean>(
    async enable => {
      await axios.patch(`${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/me`, {
        daily_magic_enabled: enable,
      });
    },
    { onSuccess: () => client.invalidateQueries(['account']) },
  );
};

export function useCountriesQuery() {
  return useQuery(
    ['countries'],
    async () => {
      const { data } = await axios.get<{ countries: Array<[string, string]> }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/countries`,
      );
      return data.countries.map(([value, label]) => ({ value, label }));
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}
