import { isMiniApp } from 'utils/version';
import { useAccountQuery } from './account';

export function useSubscription() {
  const { data: account, isLoading, refetch } = useAccountQuery();
  const subs = account?.subscription_item;
  const plan = subs?.subscription_plan;
  const planName = plan?.name || 'none';

  const level = isMiniApp ? 1 : plan?.level ?? 0;

  const levelName = level === 1 ? 'pro' : level === 2 ? 'pro+' : 'free';

  const status = subs?.status ?? 'active';

  return {
    plan,
    refetch,
    isLoading,
    title: planName,
    level,
    levelName,
    status,
    currentPeriodEnd: subs?.end_at && new Date(subs.end_at),
    remaining:
      level === 0
        ? 0
        : Math.max(Math.round(+new Date(subs?.end_at ?? 0) - Date.now()), 0),
    weeklyCustomNotificationCount: Number(
      plan?.metadata.weekly_custom_notifications_count ?? 0,
    ),
  };
}
