import { useState } from 'react';
import { useTimeout } from 'usehooks-ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSubscription } from 'api';
import { useUserStorage } from 'api/userStorage';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { useIsLoggedIn } from '../jwt-store';
import { TrialStartedModal } from './TrialStartedModal';
import { SemiForceLoginModal } from './SemiForceLoginModal';

const useSemiForceLoginModal = () => {
  const isLoggedIn = useIsLoggedIn();
  const [isReady, setIsReady] = useState(false);
  useTimeout(() => {
    setIsReady(true);
  }, 3000);

  return !isLoggedIn && isReady;
};

const useTrialStartedModal = () => {
  const { group } = useSubscription();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const userStorage = useUserStorage('trial-popup');
  useTimeout(() => {
    setIsReady(true);
  }, 1000);

  const trialStartedModal =
    group === 'trial' &&
    userStorage.value !== 'true' &&
    !userStorage.isLoading &&
    !isDismissed &&
    isReady;

  return [
    trialStartedModal,
    () => {
      setIsDismissed(false);
      void userStorage.save('true');
    },
  ] as const;
};

const useNavigateToOnboarding = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return () =>
    pathname === '/coin-radar/onboarding'
      ? null
      : navigate('/coin-radar/onboarding');
};

export function UserEngageFlow() {
  const { isEmbeddedView } = useEmbedView();

  const loginModal = useSemiForceLoginModal();
  const [trialStartedModal, dismissTrialStartedModal] = useTrialStartedModal();
  const navigateToOnboarding = useNavigateToOnboarding();

  return isEmbeddedView ? null : (
    <>
      <SemiForceLoginModal open={loginModal} />
      <TrialStartedModal
        open={trialStartedModal}
        onClose={() => {
          dismissTrialStartedModal();
          navigateToOnboarding();
        }}
      />
    </>
  );
}
