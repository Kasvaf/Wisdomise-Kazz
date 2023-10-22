import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { usePaymentMethodsQuery } from 'api';
import Button from 'shared/Button';

export default function PaymentMethods() {
  const { data } = usePaymentMethodsQuery();
  const navigate = useNavigate();

  return (
    <div>
      {data?.data[0]?.card && (
        <>
          <h1 className="mb-4 text-base font-semibold text-white">
            Payment Methods
          </h1>
          <p>
            <span>{data.data[0].card.brand}</span>{' '}
            <span>****{data.data[0].card.last4}</span>
          </p>
          <p>Next payment will be automatically collected from this card.</p>
        </>
      )}
      <Button
        className="mt-4"
        onClick={useCallback(() => {
          navigate('/account/billing/change-payment-method');
        }, [])}
      >
        Change payment method
      </Button>
    </div>
  );
}
