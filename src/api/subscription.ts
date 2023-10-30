import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { useAccountQuery } from './account';
import { usePlansQuery } from './billings';
import { type SubscriptionPlan } from './types/subscription';
import { type PageResponse } from './types/page';

export function useSubscription() {
  const { data: plans } = usePlansQuery();
  const { data: account, isLoading, refetch } = useAccountQuery();
  const subs = account?.subscription?.object;
  const status = subs?.status;
  const isActive = status === 'active';

  useEffect(() => {
    const planObj = plans?.results.find(
      plan => plan.stripe_price_id === subs?.plan.id,
    );
    if (subs && planObj) {
      if (!subs.plan.name) {
        subs.plan.name = planObj?.name;
      }

      if (!subs.plan.amount) {
        subs.plan.amount = planObj.price * 100;
      }
    }
  }, [plans, subs]);

  return {
    refetch,
    isActive,
    isLoading,
    title:
      status === 'trialing'
        ? 'Trial'
        : status === 'inactive'
        ? 'none'
        : subs?.plan.name,
    plan: subs?.plan,
    isTrialing: subs?.plan.name === 'Trial',
    cancelEnd: subs?.cancel_at && subs.cancel_at * 1000,
    currentPeriodEnd: (subs?.current_period_end ?? 0) * 1000,
    isCanceled: Boolean(subs?.canceled_at) || status === 'canceled' || !status,
    isSignalNotificationEnable: subs?.plan.metadata.enable_signal_notifications,
    remaining: Math.max(
      Math.round(((subs?.trial_end ?? 0) - Date.now() / 1000) / (60 * 60 * 24)),
      0,
    ),
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
