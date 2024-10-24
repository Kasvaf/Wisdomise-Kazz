import { useState, type PropsWithChildren } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSubscription } from 'api';
import { useIsPro } from 'modules/base/auth/is-pro';
import { useIsLoggedIn } from '../jwt-store';
import { TrialStartedModal } from './TrialStartedModal';
import { SubscriptionRequiredModal } from './SubscriptionRequiredModal';

export default function ProContent({ children }: PropsWithChildren) {
  const subscription = useSubscription();
  const isLoggedIn = useIsLoggedIn();
  const [isDismissed, setIsDismissed] = useState(false);

  const [trialModalConfirmed, setTrialModalConfirmed] = useLocalStorage(
    'trial-popup',
    'false',
  ); /* TODO: Trial: Use Account Storage */

  const isPro = useIsPro();

  const loc = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {children}
      <TrialStartedModal
        open={
          subscription.levelType === 'trial' &&
          trialModalConfirmed !== 'true' &&
          isLoggedIn &&
          !isDismissed
        }
        onClose={() => setIsDismissed(true)}
        onConfirm={() => setTrialModalConfirmed('true')}
      />
      <SubscriptionRequiredModal
        open={subscription.levelType === 'free' && isPro(loc.pathname)}
        onClose={() => navigate(-1)}
        onConfirm={() => navigate('/account/billing')}
      />
    </>
  );
}
