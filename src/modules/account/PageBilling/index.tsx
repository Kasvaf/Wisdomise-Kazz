import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInvoicesQuery, usePlansQuery, useSubscription } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import SubscriptionDetail from './SubscriptionDetail';
import PricingTable from './PricingTable';
import SuccessfulPaymentMessage from './SuccessfulPaymentMessage';

export default function PageBilling() {
  const plans = usePlansQuery();
  const invoices = useInvoicesQuery();
  const subscription = useSubscription();
  const [searchParams] = useSearchParams();
  const isAutoMode = useRef(
    searchParams.has('level') && searchParams.has('paymentMethod'),
  );

  const isLoading =
    plans.isLoading ||
    invoices.isLoading ||
    subscription.isLoading ||
    isAutoMode.current;

  return (
    <PageWrapper className="h-full" loading={isLoading} mountWhileLoading>
      {subscription.group === 'free' || subscription.group === 'initial' ? (
        <PricingTable />
      ) : (
        <SubscriptionDetail />
      )}
      <SuccessfulPaymentMessage />
    </PageWrapper>
  );
}
