import { useAccountQuery } from './account';

export function useSubscription() {
  const { data: account, isLoading, refetch } = useAccountQuery();
  const subs = account?.subscription_item;
  const plan = subs?.subscription_plan;
  const status = subs?.status;
  const isActive = status === 'active';
  const planName = plan?.name || 'none';

  const levelType: 'free' | 'trial' | 'pro' = (() => {
    if (!plan?.is_active || (plan.level ?? 0) === 0) return 'free';

    if ((plan.level ?? 0) > 1) return 'pro';

    return 'trial';
  })();

  return {
    plan,
    refetch,
    isActive,
    isLoading,
    title: planName === 'Trial' ? 'Free' : planName,
    isFreePlan: !plan?.level,
    isTrialPlan: plan?.name === 'Trial',
    level: isActive ? plan?.level ?? 0 : 0,
    levelType,
    currentPeriodEnd: subs?.end_at && new Date(subs.end_at),
    remaining: Math.max(
      Math.round(
        (+new Date(subs?.end_at ?? 0) - Date.now()) / (1000 * 60 * 60 * 24),
      ),
      0,
    ),
    weeklyCustomNotificationCount: Number(
      plan?.metadata.weekly_custom_notifications_count ?? 0,
    ),
  };
}
