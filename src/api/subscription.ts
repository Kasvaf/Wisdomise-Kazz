import { useAccountQuery } from './account';

export function useSubscription() {
  const { data: account, isLoading, refetch } = useAccountQuery();
  const subs = account?.subscription_item;
  const plan = subs?.subscription_plan;
  const status = subs?.status;
  const isActive = status === 'active';

  return {
    refetch,
    isActive,
    isLoading,
    title: plan?.name || (status === 'trialing' ? 'Trial' : 'none'),
    plan,
    isTrialing: status === 'trialing',
    currentPeriodEnd: subs?.end_at && new Date(subs.end_at),
    isCanceled: status === 'canceled' || !status,
    isSignalNotificationEnable: plan?.metadata.enable_signal_notifications,
    remaining: Math.max(
      Math.round(
        (+new Date(subs?.end_at ?? 0) - Date.now()) / (1000 * 60 * 60 * 24),
      ),
      0,
    ),
    // default 3 is for old user it will be removed by 1 month
    weeklyCustomNotificationCount:
      isActive && plan?.metadata.weekly_custom_notifications_count === undefined
        ? 3
        : Number(plan?.metadata.weekly_custom_notifications_count),
  };
}
