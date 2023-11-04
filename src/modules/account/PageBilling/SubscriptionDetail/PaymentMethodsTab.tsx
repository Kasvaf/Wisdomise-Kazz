import { useTranslation } from 'react-i18next';
import { useStripePaymentMethodsQuery } from 'api';
import Button from 'shared/Button';

export default function PaymentMethodsTab() {
  const { t } = useTranslation('billing');
  const { data } = useStripePaymentMethodsQuery();

  return (
    <div>
      {data?.data[0]?.card && (
        <>
          <h1 className="mb-4 text-base font-semibold text-white">
            {t('subscription-details.payment-methods.title')}
          </h1>
          <p>
            <span>{data.data[0].card.brand}</span>{' '}
            <span>****{data.data[0].card.last4}</span>
          </p>
          <p>{t('subscription-details.payment-methods.auto-renew-notice')}</p>
        </>
      )}
      <Button
        className="mt-4 inline-block"
        to="/account/billing/change-payment-method"
      >
        {t('change-payment.change-payment-method')}
      </Button>
    </div>
  );
}
