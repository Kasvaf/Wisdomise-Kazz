import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubscription } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import useModalSuccessful from './useModalSuccessful';
import SubscriptionDetail from './SubscriptionDetail';
import PricingTable from './PricingTable';
import { AFTER_CHECKOUT_KEY, SUCCESSFUL_CHECKOUT_KEY } from './constant';

export default function PageBilling() {
  const { hasStripe, hasSubscription } = useSubscription();
  const [searchParams] = useSearchParams();
  const [ModalSuccessful, showModalSuccessful] = useModalSuccessful({});
  const navigate = useNavigate();
  const [successShown, setSuccessShow] = useState(false);

  useEffect(() => {
    const afterCheckout = searchParams.get(AFTER_CHECKOUT_KEY);
    if (afterCheckout) {
      sessionStorage.setItem(AFTER_CHECKOUT_KEY, afterCheckout);
    }

    if (
      searchParams.has(SUCCESSFUL_CHECKOUT_KEY) &&
      hasSubscription &&
      hasStripe &&
      !successShown
    ) {
      setSuccessShow(true);
      void showModalSuccessful().then(() => navigate('/account/billing'));
    }
  }, [
    searchParams,
    showModalSuccessful,
    hasStripe,
    hasSubscription,
    navigate,
    successShown,
  ]);

  return (
    <PageWrapper>
      {hasStripe ? <SubscriptionDetail /> : <PricingTable />}
      {ModalSuccessful}
    </PageWrapper>
  );
}
