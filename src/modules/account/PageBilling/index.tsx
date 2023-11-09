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
import Web3Provider from 'modules/account/PageBilling/Web3Provider';
import useModalSuccessful from './useModalSuccessful';
import SubscriptionDetail from './SubscriptionDetail';
import PricingTable from './PricingTable';

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
    <Web3Provider>
      <PageWrapper loading={isLoading || invoices.isLoading}>
        {isActive || firstPaymentMethod === 'CRYPTO' ? (
          <SubscriptionDetail />
        ) : (
          <PricingTable />
        )}
        {ModalSuccessful}
      </PageWrapper>
    </Web3Provider>
  );
}
