import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from 'api';
import { useUserStorage } from 'api/userStorage';
import { appendTraits } from 'config/segment';
import { useIsLoggedIn } from '../../auth/jwt-store';
import { SemiForceLoginModal } from './SemiForceLoginModal';

const useSemiForceLoginModal = () => {
  const isLoggedIn = useIsLoggedIn();
  return <SemiForceLoginModal open={!isLoggedIn} />;
};

const ONBOARDING_URL = '/coin-radar/onboarding';
const useNavigateToOnboarding = () => {
  const navigate = useNavigate();
  const { group } = useSubscription();
  const { value } = useUserStorage('onboarding-data');

  useEffect(() => {
    if (value === undefined) return;
    if (value === null) {
      navigate(ONBOARDING_URL);
    } else {
      try {
        void appendTraits({ onboardingData: JSON.parse(value) });
      } catch {}
    }
  }, [group, navigate, value]);
};

export const UserEngageFlow = () => {
  const loginModal = useSemiForceLoginModal();
  useNavigateToOnboarding();

  return <>{loginModal}</>;
};
