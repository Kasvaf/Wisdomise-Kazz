import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN, INVESTMENT_ORIGIN } from 'config/constants';
import { setJwtToken, useJwtEmail } from 'modules/base/auth/jwt-store';
import { ofetch } from 'config/ofetch';
import { type Account } from './types/UserInfoResponse';

export function useAccountQuery() {
  const email = useJwtEmail();
  return useQuery<Account | null>(
    ['account', email],
    async () => {
      const data = await ofetch<Account>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/me`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}

interface ReferralStatus {
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
      const data = await ofetch<ReferralStatus>(
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

interface SetupIntentResponse {
  client_secret: string;
}

export function useStripeSetupIntentQuery() {
  return useQuery(
    ['getStripeSetupIntent'],
    async () => {
      const data = await ofetch<SetupIntentResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/stripe/setup-intent`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}

export interface CommunityProfile {
  overview: string | null;
  profile_image: string | null;
  profile_cover: string | null;
  nickname: string | null;
  support_email: string | null;
  website: string | null;
  telegram: string | null;
  twitter: string | null;
  discord: string | null;
  youtube: string | null;
  linked_in: string | null;
  verified: boolean;
  active_since: string;
}

export function useCommunityProfileQuery() {
  return useQuery(['community-profile'], async () => {
    const data = await ofetch<CommunityProfile>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/community_profile`,
    );
    return data;
  });
}

export function useCommunityProfileMutation() {
  const client = useQueryClient();
  return useMutation<unknown, unknown, Partial<CommunityProfile>>(
    async newProfile => {
      await ofetch(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/community_profile`,
        { body: newProfile, method: 'patch' },
      );
    },
    {
      onSuccess: () =>
        client.invalidateQueries([
          'community-profile',
          // TODO Invalidate related trader profile
        ]),
    },
  );
}

export type ImageUploaderTarget = 'profile_image' | 'profile_cover';

export const useUploaderMutation = (target: ImageUploaderTarget) => {
  return useMutation<string, unknown, File>({
    mutationFn: async file => {
      const formData = new FormData();
      formData.append('image', file);
      const resp = await ofetch<{
        image_url: string;
      }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/community_profile/${target}`,
        {
          body: formData,
          method: 'put',
        },
      );
      return resp.image_url;
    },
  });
};

interface MiniAppLoginResponse {
  token: string;
}

export function useGameLoginQuery(query?: string, quickLogin?: boolean) {
  return useQuery(
    ['gameLogin', query, quickLogin],
    async () => {
      const data = await ofetch<MiniAppLoginResponse>(
        `${INVESTMENT_ORIGIN}/api/v1/account/mini_app/login?${query || ''}`,
        {
          meta: { auth: false },
        },
      );

      if (!quickLogin) {
        setJwtToken(data.token);
      }
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      refetchOnMount: true,
      enabled: !!query && !quickLogin,
    },
  );
}
