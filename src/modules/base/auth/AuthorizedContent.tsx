import { useEffect, type PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccountQuery, useHasFlag } from 'api';
import Button from 'shared/Button';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { useIsLoggedIn } from './jwt-store';

const AuthorizedContent: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const hasFlag = useHasFlag();
  const isAuthorized = hasFlag('?');
  const isLoggedIn = useIsLoggedIn();
  const { isFetching } = useAccountQuery();
  const [ModalLogin, ensureAuthenticated] = useEnsureAuthenticated();

  useEffect(() => {
    if (isLoggedIn && !isAuthorized && !isFetching) {
      navigate('/coin-radar/overview');
    }
  }, [isAuthorized, isFetching, isLoggedIn, navigate]);

  return isAuthorized ? (
    <>{children}</>
  ) : (
    <div className="mt-12 flex h-full flex-col items-center justify-center gap-4 text-v1-content-primary">
      <div>{t('error-not-authorized')}</div>
      <Button onClick={ensureAuthenticated}>{t('base:user.sign-in')}</Button>
      {ModalLogin}
    </div>
  );
};

export default AuthorizedContent;
