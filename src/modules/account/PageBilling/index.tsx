import { useInvoicesQuery, usePlansQuery, useSubscription } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import SubscriptionDetail from './SubscriptionDetail';
import PricingTable from './PricingTable';
import SuccessfulPaymentMessage from './SuccessfulPaymentMessage';

export default function PageBilling() {
  const plans = usePlansQuery();
  const invoices = useInvoicesQuery();
  const { isLoading, levelType } = useSubscription();

  return (
    <PageWrapper
      className="h-full"
      loading={isLoading || invoices.isLoading || plans.isLoading}
    >
      {levelType === 'pro' ? <SubscriptionDetail /> : <PricingTable />}
      <SuccessfulPaymentMessage />
    </PageWrapper>
  );
}
