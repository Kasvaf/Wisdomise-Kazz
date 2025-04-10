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
    <PageWrapper
      hasBack
      className="h-full"
      loading={isLoading}
      mountWhileLoading
      title={null}
    >
      {subscription.group === 'free' || subscription.group === 'initial' ? (
        <PricingTable />
      ) : (
        <SubscriptionDetail />
      )}
      <SuccessfulPaymentMessage />
    </PageWrapper>
  );
}
