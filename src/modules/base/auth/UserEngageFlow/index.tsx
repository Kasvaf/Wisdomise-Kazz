import { useEffect, useState } from 'react';
import { useTimeout } from 'usehooks-ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const ONBOARDING_URL = '/coin-radar/onboarding';
const useOnboarding = () => {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { group } = useSubscription();
  const { value, isLoading } = useUserStorage('onboarding-data');

  useEffect(() => {
    if (!group) return;
    setOnboardingDone(false);
  }, [group, setOnboardingDone]);

  useEffect(() => {
    if (searchParams.get('onboarding') === 'done') {
      setOnboardingDone(true);
      searchParams.delete('onboarding');
      setSearchParams(searchParams);
    }
  }, [searchParams, setOnboardingDone, setSearchParams]);

  useEffect(() => {
    if (!isLoading && !value && !onboardingDone && group !== 'guest') {
      navigate(ONBOARDING_URL);
    }
  }, [group, isLoading, navigate, onboardingDone, value]);
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
