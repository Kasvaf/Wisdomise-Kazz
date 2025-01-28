import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from 'api';
import { useUserStorage } from 'api/userStorage';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { useIsLoggedIn } from '../jwt-store';
import { SemiForceLoginModal } from './SemiForceLoginModal';

const useSemiForceLoginModal = () => {
  const isLoggedIn = useIsLoggedIn();
  return !isLoggedIn;
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
  useOnboarding();

  return isEmbeddedView ? null : (
    <>
      <SemiForceLoginModal open={loginModal} />
    </>
  );
}
