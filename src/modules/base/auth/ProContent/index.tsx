import { useState, type PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSubscription } from 'api';
import { useIsPro } from 'modules/base/auth/is-pro';
import { useUserStorage } from 'api/userStorage';
import { useIsLoggedIn } from '../jwt-store';
import { TrialStartedModal } from './TrialStartedModal';
import { SubscriptionRequiredModal } from './SubscriptionRequiredModal';

export default function ProContent({ children }: PropsWithChildren) {
  const subscription = useSubscription();
  const isLoggedIn = useIsLoggedIn();
  const [isDismissed, setIsDismissed] = useState(false);

  const userStorage = useUserStorage('trial-popup', 'false');

  const isPro = useIsPro();

  const loc = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {children}
      <TrialStartedModal
        open={
          !userStorage.isLoading &&
          subscription.levelType === 'trial' &&
          userStorage.value !== 'true' &&
          isLoggedIn &&
          !isDismissed
        }
        onClose={() => setIsDismissed(true)}
        onConfirm={() => {
          setIsDismissed(true);
          void userStorage.save('true');
        }}
      />
      <SubscriptionRequiredModal
        open={subscription.levelType === 'free' && isPro(loc.pathname)}
        onClose={() => navigate(-1)}
        onConfirm={() => navigate('/account/billing')}
      />
    </>
  );
}
