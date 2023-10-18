import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import {
  type Invoice,
  type PaymentMethodsResponse,
} from 'modules/account/models';
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

export function useInvoicesQuery() {
  return useQuery(
    ['getInvoices'],
    async () => {
      const { data } = await axios.get<PageResponse<Invoice>>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/invoices`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}

export function usePaymentMethodsQuery() {
  return useQuery(
    ['getPaymentMethods'],
    async () => {
      const { data } = await axios.get<PaymentMethodsResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/stripe/payment-methods`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}

export interface UpdateSubscriptionRequest {
  price_id: string;
}

export function useSubscriptionMutation() {
  return useMutation<unknown, unknown, UpdateSubscriptionRequest>(
    ['patchSubscription'],
    async body => {
      const { data } = await axios.patch<
        unknown,
        PaymentMethodsResponse,
        UpdateSubscriptionRequest
      >(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/stripe/subscriptions`,
        body,
      );
      return data;
    },
  );
}
