import { useAccountQuery } from 'api';

export default function useIsSubscribed() {
  const account = useAccountQuery();
  if (!account.data?.subscription?.object) return;
  return !!account.data?.stripe_customer_id;
}
