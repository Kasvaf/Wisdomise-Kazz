import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimeout } from 'usehooks-ts';
import { useSubscription } from 'api';
import { useUserStorage } from 'api/userStorage';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { useIsLoggedIn } from '../jwt-store';
import { TrialStartedModal } from './TrialStartedModal';
import { SemiForceLoginModal } from './SemiForceLoginModal';

const useSemiForceLoginModal = () => {
  const isLoggedIn = useIsLoggedIn();
  return !isLoggedIn;
};

const useTrialStartedModal = () => {
  const { group } = useSubscription();
  const [isDismissed, setIsDismissed] = useState(false);
  const userStorage = useUserStorage('trial-popup');
  const [isReady, setIsReady] = useState(false);

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

const ONBOARDING_URL = '/coin-radar/onboarding';
const useOnboarding = () => {
  const navigate = useNavigate();
  const { group } = useSubscription();
  const { value, save, isLoading } = useUserStorage(
    'onboarding-navigate',
    'false',
  );

  useEffect(() => {
    if (!isLoading && value !== 'true' && group !== 'guest') {
      void save('true');
      navigate(ONBOARDING_URL);
    }
  }, [group, isLoading, navigate, save, value]);
};

export function UserEngageFlow() {
  const { isEmbeddedView } = useEmbedView();
  const loginModal = useSemiForceLoginModal();
  const [trialStartedModal, dismissTrialStartedModal] = useTrialStartedModal();
  useOnboarding();

  return isEmbeddedView ? null : (
    <>
      <SemiForceLoginModal open={loginModal} />
      <TrialStartedModal
        open={trialStartedModal}
        onClose={() => {
          dismissTrialStartedModal();
        }}
      />
    </>
  );
}
