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

export function useSubscription() {
  const account = useAccountQuery();
  const subs = account.data?.subscription?.object;
  const status = subs?.status;

  const { data: subscriptionPortal } = useQuery(
    ['sub-portal'],
    async () => {
      const { data } = await axios.get<SubscriptionPortal>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/stripe/billing_portal/`,
      );
      return data.url;
    },
    {
      enabled: !!account.data?.stripe_customer_id,
      staleTime: Number.POSITIVE_INFINITY,
    },
  );

  return {
    isActive: status === 'active',
    isTrialing: status === 'trialing',
    isCanceled: Boolean(subs?.canceled_at),
    cancelEnd: subs?.cancel_at && subs.cancel_at * 1000,
    hasStripe: Boolean(account.data?.stripe_customer_id),
    subscriptionPortal,
    remaining: Math.max(
      Math.round(
        ((subs?.trial_end ?? 0) - (subs?.trial_start ?? 0)) / (60 * 60 * 24),
      ),
      0,
    ),
  };
}
