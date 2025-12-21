import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CLIENT_PUBLIC_KEY } from 'config/constants';
import PageWrapper from 'modules/base/PageWrapper';
import { useState } from 'react';
import { useStripeSetupIntentQuery } from 'services/rest';
import ChangeStripeCardInfoForm from './ChangeStripeCardInfoForm';

export default function ChangeStripeCardInfoPage() {
  const { data } = useStripeSetupIntentQuery();
  const [stripePromise] = useState(() => loadStripe(STRIPE_CLIENT_PUBLIC_KEY));

  if (!data) {
    return (
      <PageWrapper hasBack title={null}>
        No Data
      </PageWrapper>
    );
  }

  return (
    <PageWrapper hasBack title={null}>
      <Elements
        options={{
          fonts: [
            { cssSrc: 'https://fonts.googleapis.com/css?family=Poppins' },
          ],
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
          clientSecret: data.client_secret,
        }}
        stripe={stripePromise}
      >
        <ChangeStripeCardInfoForm />
      </Elements>
    </PageWrapper>
  );
}
