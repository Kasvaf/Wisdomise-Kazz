import { useEffect, type PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccountQuery, useHasFlag } from 'api';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { useIsLoggedIn } from './jwt-store';
import { Button } from 'shared/v1-components/Button';

const AuthorizedContent: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const hasFlag = useHasFlag();
  const isAuthorized = hasFlag('?');
  const isLoggedIn = useIsLoggedIn();
  const { isFetching, isPending } = useAccountQuery();
  const [ModalLogin, ensureAuthenticated] = useEnsureAuthenticated();

  useEffect(() => {
    if (isLoggedIn && !isAuthorized && !isFetching && !isPending) {
      navigate('/discovery');
    }
  }, [isAuthorized, isFetching, isLoggedIn, navigate, isPending]);

  return isAuthorized ? (
    <>{children}</>
  ) : (
    <div className="text-v1-content-primary mt-12 flex h-full flex-col items-center justify-center gap-4">
      <div>{t('error-not-authorized')}</div>
      <Button size="md" onClick={ensureAuthenticated}>
        {t('base:user.sign-in')}
      </Button>
      {ModalLogin}
    </div>
  );
};

export default AuthorizedContent;
