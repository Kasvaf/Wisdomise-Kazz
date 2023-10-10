import { Elements } from '@stripe/react-stripe-js';
import {
  loadStripe,
  type StripeElementsOptionsClientSecret,
} from '@stripe/stripe-js';
import { useStripeSetupIntentQuery } from 'api';
import { STRIPE_CLIENT_PUBLIC_KEY } from 'config/constants';
import ChangePaymentMethodForm from 'modules/account/PageBilling/ChangePaymentMethodForm';

const stripePromise = loadStripe(STRIPE_CLIENT_PUBLIC_KEY);

const options: StripeElementsOptionsClientSecret = {
  fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Poppins' }],
  appearance: {
    theme: 'night',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#000',
      colorText: '#fff',
      colorDanger: '#df1b41',
      fontFamily: 'Poppins, sans-serif',
      spacingGridRow: '1.5rem',
      spacingGridColumn: '1.5rem',
      borderRadius: '40px',
    },
  },
};

export default function ChangePaymentMethodPage() {
  const { data } = useStripeSetupIntentQuery();

  return (
    <>
      {data && (
        <Elements
          stripe={stripePromise}
          options={{ ...options, clientSecret: data.client_secret }}
        >
          <ChangePaymentMethodForm />
        </Elements>
      )}
    </>
  );
}
