import { useInvoicesQuery, useSubscription } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import SubscriptionDetail from './SubscriptionDetail';
import PricingTable from './PricingTable';
import SuccessfulPaymentMessage from './SuccessfulPaymentMessage';

export default function PageBilling() {
  const invoices = useInvoicesQuery();
  const { plan, isActive, isLoading } = useSubscription();

  const lastInvoice = invoices.data?.results.at(0);
  const hasOpenCryptoPayment =
    lastInvoice?.payment_method === 'CRYPTO' && lastInvoice.status === 'open';

  return (
    <PageWrapper loading={isLoading || invoices.isLoading}>
      {(isActive && plan?.name !== 'Trial') || hasOpenCryptoPayment ? (
        <SubscriptionDetail />
      ) : (
        <PricingTable />
      )}
      <SuccessfulPaymentMessage />
    </PageWrapper>
  );
}
