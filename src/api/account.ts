import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN, TEMPLE_ORIGIN } from 'config/constants';
import { setJwtToken, useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { type Account } from './types/UserInfoResponse';

export function useAccountQuery() {
  const isLoggedIn = useIsLoggedIn();
  return useQuery<Account | null>(
    ['account', isLoggedIn],
    async () => {
      // if (!isLoggedIn) return null;
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

interface SetupIntentResponse {
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
    const { data } = await axios.get<CommunityProfile>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/community_profile`,
    );
    return data;
  });
}

export function useCommunityProfileMutation() {
  const client = useQueryClient();
  return useMutation<unknown, unknown, Partial<CommunityProfile>>(
    async newProfile => {
      await axios.patch(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/community_profile`,
        newProfile,
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
      const resp = await axios.put<{
        image_url: string;
      }>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/community_profile/${target}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      return resp.data.image_url;
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
      const { data } = await axios.get<MiniAppLoginResponse>(
        `${TEMPLE_ORIGIN}/api/v1/account/mini_app/login?${query || ''}`,
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
