import { useAccountQuery } from './account';

export function useSubscription() {
  const { data: account, isLoading, refetch } = useAccountQuery();
  const subs = account?.subscription_item;
  const plan = subs?.subscription_plan;
  const status = subs?.status;
  const isActive = status === 'active';
  const planName = plan?.name || 'none';

  const levelType: 'free' | 'trial' | 'pro' = (() => {
    if (plan?.level === 0) return 'free';
    if (status === 'trialing') return 'trial';
    return 'pro';
  })();

  return {
    plan,
    refetch,
    isActive,
    isLoading,
    title: planName,
    isFreePlan: !plan?.level,
    isTrialPlan: plan?.name === 'Trial',
    level: isActive ? plan?.level ?? 0 : 0,
    levelType,
    currentPeriodEnd: subs?.end_at && new Date(subs.end_at),
    remaining:
      levelType === 'free'
        ? 0
        : Math.max(
            Math.round(
              (+new Date(subs?.end_at ?? 0) - Date.now()) /
                (1000 * 60 * 60 * 24),
            ),
            0,
          ),
    weeklyCustomNotificationCount: Number(
      plan?.metadata.weekly_custom_notifications_count ?? 0,
    ),
  };
}
