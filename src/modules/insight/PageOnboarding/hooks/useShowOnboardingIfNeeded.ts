import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { useSubscription } from 'api';

const ONBOARDING_PATH = '/coin-radar/onboarding';

export const useShowOnboardingIfNeeded = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { group } = useSubscription();
  const navigate = useNavigate();
  const [shown, setShown] = useLocalStorage('coinradar-onboarding', false);

  useEffect(() => {
    if (
      !shown &&
      pathname !== ONBOARDING_PATH &&
      group !== 'free' /* && group === 'trial' NAITODO ask kasra */
    ) {
      navigate(`${ONBOARDING_PATH}?next=${encodeURIComponent(pathname)}`);
    }
  }, [group, navigate, pathname, shown]);

  return () => {
    const next = searchParams.get('next') ?? '/coin-radar/overview';
    setShown(true);
    navigate(next);
  };
};
