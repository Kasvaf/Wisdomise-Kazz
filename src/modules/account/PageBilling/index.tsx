import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useInvoicesQuery,
  useSubscription,
  useUserFirstPaymentMethod,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import {
  AFTER_CHECKOUT_KEY,
  SUCCESSFUL_CHECKOUT_KEY,
} from 'modules/auth/constants';
import useModalSuccessful from './useModalSuccessful';
import SubscriptionDetail from './SubscriptionDetail2';
import PricingTable from './PricingTable2';

export default function PageBilling() {
  const navigate = useNavigate();
  const invoices = useInvoicesQuery();
  const [searchParams] = useSearchParams();
  const { isActive, isLoading } = useSubscription();
  const [successShown, setSuccessShow] = useState(false);
  const firstPaymentMethod = useUserFirstPaymentMethod();
  const [ModalSuccessful, showModalSuccessful] = useModalSuccessful({});

  useEffect(() => {
    const afterCheckout = searchParams.get(AFTER_CHECKOUT_KEY);
    if (afterCheckout) {
      sessionStorage.setItem(AFTER_CHECKOUT_KEY, afterCheckout);
    }

    if (
      searchParams.has(SUCCESSFUL_CHECKOUT_KEY) &&
      isActive &&
      !successShown
    ) {
      setSuccessShow(true);
      void showModalSuccessful().then(() => navigate('/account/billing'));
    }
  }, [searchParams, showModalSuccessful, isActive, navigate, successShown]);

  return (
    <PageWrapper loading={isLoading || invoices.isLoading}>
      {isActive || firstPaymentMethod === 'CRYPTO' ? (
        <SubscriptionDetail />
      ) : (
        <PricingTable />
      )}
      {ModalSuccessful}
    </PageWrapper>
  );
}
