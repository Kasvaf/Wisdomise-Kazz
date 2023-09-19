import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type PageResponse } from './types/page';
import { type PlanPeriod, type SubscriptionPlan } from './types/subscription';
import { useUserInfoQuery } from './account';

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
  const userInfo = useUserInfoQuery();
  const user = userInfo.data?.account;
  const subs = user?.subscription?.object;
  const isTrialing = subs?.status === 'trialing';
  return {
    isTrialing,
    hasSubscription: !user?.subscription?.object?.canceled_at,
    hasStripe: !!user?.stripe_customer_id,
    remaining: Math.round(
      ((subs?.trial_end ?? 0) - (subs?.trial_start ?? 0)) / (60 * 60 * 24),
    ),
  };
}
