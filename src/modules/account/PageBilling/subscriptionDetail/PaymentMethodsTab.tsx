import { useStripePaymentMethodsQuery } from 'api';
import Button from 'shared/Button';

export default function PaymentMethodsTab() {
  const { data } = useStripePaymentMethodsQuery();

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
        className="mt-4 inline-block"
        to="/account/billing/change-payment-method"
      >
        Change payment method
      </Button>
    </div>
  );
}
