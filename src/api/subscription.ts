import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { type PageResponse } from './types/page';
import {
  type SubscriptionPortal,
  type PlanPeriod,
  type SubscriptionPlan,
} from './types/subscription';
import { useAccountQuery } from './account';

export function usePlansQuery(periodicity?: PlanPeriod) {
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
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
}

export function useActivePlan() {
  const { data: account } = useAccountQuery();
  const planId = account?.subscription?.object?.plan.id;
  return useQuery(
    ['activePlan', planId],
    async () => {
      if (!planId) return;
      const { data } = await axios.get<PageResponse<SubscriptionPlan>>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/subscription/plans?stripe_price_id=${planId}`,
      );
      return data.results?.[0];
    },
    {
      enabled: Boolean(planId),
      staleTime: Number.POSITIVE_INFINITY,
    },
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
  const { data: plansResponse } = usePlansQuery(undefined);
  const subs = account?.subscription?.object;
  const status = subs?.status;
  const isActive = status === 'active';

  return {
    isActive,
    isLoading,
    title:
      status === 'trialing'
        ? 'Trial'
        : status === 'inactive'
        ? 'none'
        : subs?.plan.name,
    isTrialing: status === 'trialing',
    isCanceled: Boolean(subs?.canceled_at) || status === 'canceled' || !status,
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

    isSignalNotificationEnable: subs?.plan.metadata.enable_signal_notifications,
  };
}

export function usePlanMetadata(key: keyof SubscriptionPlan['metadata']) {
  const account = useAccountQuery();
  return account.data?.subscription?.object?.plan.metadata[key];
}
