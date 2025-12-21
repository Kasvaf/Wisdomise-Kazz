import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccountQuery } from 'services/rest';
import Button from 'shared/Button';
import Card from 'shared/Card';

export default function ChangeStripeCardInfoForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { data } = useAccountQuery();
  const { t } = useTranslation('billing');
  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/account/billing`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="mb-4 font-semibold text-base text-white capitalize">
        {t('stripe.change-card-info.title')}
      </h1>
      <form
        className="grid grid-cols-12 gap-8"
        id="payment-form"
        onSubmit={handleSubmit}
      >
        <div className="col-span-12 lg:col-span-8">
          {data && (
            <PaymentElement
              id="payment-element"
              options={{
                defaultValues: { billingDetails: { email: data.email } },
              }}
            />
          )}
        </div>
        <Card className="col-span-12 flex flex-col justify-between text-white lg:col-span-4">
          <div>
            <h1 className="mb-4">
              {t('stripe.change-card-info.order-summary')}
            </h1>
            <div className="flex justify-between gap-4 text-gray-400">
              <span>{t('stripe.change-card-info.title')}</span>
              <span>$0.00</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between gap-4 font-bold">
              <span>{t('stripe.change-card-info.total')}</span>
              <span>$0.00</span>
            </div>
          </div>
          <div>
            <Button
              className="mt-4 w-full"
              disabled={isLoading || !stripe || !elements}
            >
              <span id="button-text">
                {isLoading ? <div id="spinner"></div> : 'Continue'}
              </span>
            </Button>
            {message && <div id="payment-message">{message}</div>}
          </div>
        </Card>
      </form>
    </div>
  );
}
