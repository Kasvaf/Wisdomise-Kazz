import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useInvoicesQuery,
  useSubscription,
  useUserLastPaymentMethod,
} from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import {
  AFTER_CHECKOUT_KEY,
  SUCCESSFUL_CHECKOUT_KEY,
} from 'modules/auth/constants';
import useModalSuccessful from './useModalSuccessful';
import SubscriptionDetail from './SubscriptionDetail';
import PricingTable from './PricingTable';

export default function PageBilling() {
  const navigate = useNavigate();
  const invoices = useInvoicesQuery();
  const [searchParams] = useSearchParams();
  const { plan, isActive, isLoading } = useSubscription();
  const [successShown, setSuccessShow] = useState(false);
  const lastPaymentMethod = useUserLastPaymentMethod();
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
      {isActive &&
      (plan?.name !== 'Trial' || lastPaymentMethod === 'CRYPTO') ? (
        <SubscriptionDetail />
      ) : (
        <PricingTable />
      )}
      {ModalSuccessful}
    </PageWrapper>
  );
}
