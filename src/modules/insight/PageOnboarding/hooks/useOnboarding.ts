import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useUserStorage } from 'api/userStorage';
import { useSubscription } from 'api';

const ONBOARDING_PATH = '/coin-radar/onboarding';

export const useOnboarding = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoading, save, value } = useUserStorage('onboarding');
  const { group } = useSubscription();

  return useMemo(
    () => ({
      isLoading,
      navigateIfNeeded: () => {
        if (
          value !== 'true' &&
          group === 'trial' &&
          pathname !== ONBOARDING_PATH
        ) {
          navigate(`${ONBOARDING_PATH}?next=${encodeURIComponent(pathname)}`);
        }
      },
      done: async () => {
        if (isLoading) return;
        const next = searchParams.get('next') ?? '/coin-radar/overview';
        await save('true');
        navigate(next);
      },
    }),
    [group, isLoading, navigate, pathname, save, searchParams, value],
  );
};
