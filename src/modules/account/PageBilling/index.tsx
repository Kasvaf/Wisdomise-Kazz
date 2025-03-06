import { useInvoicesQuery, usePlansQuery, useSubscription } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import SubscriptionDetail from './SubscriptionDetail';
import PricingTable from './PricingTable';
import SuccessfulPaymentMessage from './SuccessfulPaymentMessage';

export default function PageBilling() {
  const plans = usePlansQuery();
  const invoices = useInvoicesQuery();
  const subscription = useSubscription();

  const isLoading =
    plans.isLoading || invoices.isLoading || subscription.isLoading;

  return (
    <PageWrapper className="h-full" loading={isLoading}>
      {subscription.level === 0 || subscription.status === 'canceled' ? (
        <PricingTable />
      ) : (
        <SubscriptionDetail />
      )}
      <SuccessfulPaymentMessage />
    </PageWrapper>
  );
}
