import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from 'api';
import { useUserStorage } from 'api/userStorage';
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
    if (value === null && group !== 'guest') {
      navigate(ONBOARDING_URL);
    }
  }, [group, navigate, value]);
};

export const UserEngageFlow = () => {
  const loginModal = useSemiForceLoginModal();
  useNavigateToOnboarding();

  return <>{loginModal}</>;
};
