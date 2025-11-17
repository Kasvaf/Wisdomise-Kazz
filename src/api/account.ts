import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import type { PageResponse } from 'api/types/page';
import { ACCOUNT_PANEL_ORIGIN, INVESTMENT_ORIGIN } from 'config/constants';
import { ofetch } from 'config/ofetch';
import { setGameJwtToken, useJwtEmail } from 'modules/base/auth/jwt-store';
import type { Account } from './types/UserInfoResponse';

export function useAccountQuery(config?: { suspense?: boolean }) {
  const email = useJwtEmail();
  return (config?.suspense ? useSuspenseQuery : useQuery)<Account | null>({
    queryKey: ['account', email],
    queryFn: async () => {
      const data = await ofetch<Account>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/me`,
      );
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    meta: {
      persist: false,
    },
  });
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
  trader_referred_users_count: number;
  referral_subscription_revenue: number;
  referral_trade_revenue: number;
  ready_to_claim: number;
}

interface ReferredUser {
  name: string;
  created_at: string;
  is_subscribed: boolean;
  is_trader: boolean;
}

export function useReferralStatusQuery() {
  return useQuery({
    queryKey: ['getReferralStatus'],
    queryFn: async () => {
      return await ofetch<ReferralStatus>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/referral-status`,
      );
    },
  });
}

export function useClaimReferralBonusBag() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await ofetch(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/referral-claim`,
        { method: 'post' },
      );
    },
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: ['getReferralStatus'],
      }),
  });
}

export function useFriendsQuery() {
  return useQuery({
    queryKey: ['getFriends'],
    queryFn: async () => {
      return await ofetch<PageResponse<ReferredUser>>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/referred-users`,
      );
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
}

interface SetupIntentResponse {
  client_secret: string;
}

export function useStripeSetupIntentQuery() {
  return useQuery({
    queryKey: ['getStripeSetupIntent'],
    queryFn: async () => {
      const data = await ofetch<SetupIntentResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/stripe/setup-intent`,
      );
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
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
  return useQuery({
    queryKey: ['community-profile'],
    queryFn: async () => {
      const data = await ofetch<CommunityProfile>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/community_profile`,
      );
      return data;
    },
  });
}

export function useCommunityProfileMutation() {
  const client = useQueryClient();
  return useMutation<unknown, unknown, Partial<CommunityProfile>>({
    mutationFn: async newProfile => {
      await ofetch(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/account/users/community_profile`,
        { body: newProfile, method: 'patch' },
      );
    },
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: [
          'community-profile',
          // TODO Invalidate related trader profile
        ],
      }),
  });
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
  return useQuery({
    queryKey: ['gameLogin', query, quickLogin],
    queryFn: async () => {
      const data = await ofetch<MiniAppLoginResponse>(
        `${INVESTMENT_ORIGIN}/api/v1/account/mini_app/login?${query || ''}`,
        {
          meta: { auth: false },
        },
      );

      if (!quickLogin) {
        setGameJwtToken(data.token);
      }
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchInterval: 60 * 60 * 1000,
    refetchOnMount: true,
    enabled: !!query && !quickLogin,
    meta: {
      persist: false,
    },
  });
}
