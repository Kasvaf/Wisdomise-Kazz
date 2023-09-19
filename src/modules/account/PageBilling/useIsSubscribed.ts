import { useUserInfoQuery } from 'api';

export default function useIsSubscribed() {
  const userInfo = useUserInfoQuery();
  const user = userInfo.data?.account;
  if (!user?.subscription?.object) return;

  return !!user?.stripe_customer_id;

  // return user?.subscription?.object?.status
  //   ? ['trialing', 'active'].includes(user.subscription.object.status)
  //   : false;
}
