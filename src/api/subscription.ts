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
  const { data: account, isLoading, refetch } = useAccountQuery();
  const { data: plansResponse } = usePlansQuery(undefined, {
    staleTime: Number.POSITIVE_INFINITY,
  });
  const subs = account?.subscription?.object;
  const status = subs?.status;
  const isActive = status === 'active';

  return {
    isActive,
    isLoading,
    isTrialing: status === 'trialing',
    isCanceled: Boolean(subs?.canceled_at) || status === 'canceled',
    cancelEnd: subs?.cancel_at && subs.cancel_at * 1000,
    hasStripe: Boolean(account?.stripe_customer_id),
    remaining: Math.max(
      Math.round(((subs?.trial_end ?? 0) - Date.now() / 1000) / (60 * 60 * 24)),
      0,
    ),
    currentPeriodEnd: (subs?.current_period_end ?? 0) * 1000,
    plan: subs?.plan,
    planName: plansResponse?.results.find(
      plan => plan.stripe_price_id === subs?.plan.id,
    )?.name,
    refetch,

    // default 3 is for old user it will be removed by 1 month
    weeklyCustomNotificationCount:
      isActive &&
      subs?.plan.metadata.weekly_custom_notifications_count === undefined
        ? 3
        : Number(subs?.plan.metadata.weekly_custom_notifications_count),
  };
}

export function usePlanMetadata(key: keyof SubscriptionPlan['metadata']) {
  const account = useAccountQuery();
  return account.data?.subscription?.object?.plan.metadata[key];
}
