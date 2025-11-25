import { appendTraits } from 'config/segment';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from 'services/rest';
import { useUserStorage } from 'services/rest/userStorage';
import { useIsLoggedIn } from '../../auth/jwt-store';
import { SemiForceLoginModal } from './SemiForceLoginModal';

const useSemiForceLoginModal = () => {
  const isLoggedIn = useIsLoggedIn();
  return <SemiForceLoginModal open={!isLoggedIn} />;
};

// const ONBOARDING_URL = '/onboarding';
const useNavigateToOnboarding = () => {
  const navigate = useNavigate();
  const { group } = useSubscription();
  const { value } = useUserStorage('onboarding-data');

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (value) {
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
