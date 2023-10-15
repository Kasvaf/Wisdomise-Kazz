import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type PageResponse } from './types/page';
import {
  type SubscriptionPortal,
  type PlanPeriod,
  type SubscriptionPlan,
} from './types/subscription';
import { useAccountQuery } from './account';

export function usePlansQuery(
  periodicity?: PlanPeriod,
  options?: UseQueryOptions<
    PageResponse<SubscriptionPlan>,
    AxiosError,
    PageResponse<SubscriptionPlan>,
    [string, PlanPeriod | undefined]
  >,
) {
  return useQuery(
    ['getPlans', periodicity],
    async ({ queryKey }) => {
      const [, periodicity] = queryKey;
      const params = new URLSearchParams();
      if (periodicity) {
        params.set('periodicity', periodicity);
      }
      const { data } = await axios.get<PageResponse<SubscriptionPlan>>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/plans?${params.toString()}`,
      );
      return data;
    },
    options,
  );
}

export const useCreateUserPlan = () => async (body: { plan_key: string }) => {
  const { data } = await axios.post<PageResponse<SubscriptionPlan>>(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/user-plans`,
    body,
  );
  return data;
};

export const getBilingPortal = async () => {
  const { data } = await axios.get<SubscriptionPortal>(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/stripe/billing_portal/`,
  );
  return data.url;
};

export function useSubscription() {
  const { data: account, isLoading } = useAccountQuery();
  const subs = account?.subscription?.object;
  const status = subs?.status;

  return {
    isLoading,
    title:
      status === 'trialing'
        ? 'Trial'
        : status === 'inactive'
        ? 'none'
        : subs?.plan.name,
    isActive: status === 'active',
    isTrialing: status === 'trialing',
    isCanceled: Boolean(subs?.canceled_at) || status === 'canceled',
    cancelEnd: subs?.cancel_at && subs.cancel_at * 1000,
    hasStripe: Boolean(account?.stripe_customer_id),
    remaining: Math.max(
      Math.round(((subs?.trial_end ?? 0) - Date.now() / 1000) / (60 * 60 * 24)),
      0,
    ),
  };
}

export function usePlanMetadata(key: keyof SubscriptionPlan['metadata']) {
  const account = useAccountQuery();
  return account.data?.subscription?.object?.plan.metadata[key];
}
