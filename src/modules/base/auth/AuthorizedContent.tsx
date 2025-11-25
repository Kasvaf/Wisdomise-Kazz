import { type PropsWithChildren, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAccountQuery, useHasFlag } from 'services/rest';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { Button } from 'shared/v1-components/Button';
import { useIsLoggedIn } from './jwt-store';

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
      navigate('/trench');
    }
  }, [isAuthorized, isFetching, isLoggedIn, navigate, isPending]);

  return isAuthorized ? (
    <>{children}</>
  ) : (
    <div className="mt-12 flex h-full flex-col items-center justify-center gap-4 text-v1-content-primary">
      <div>{t('error-not-authorized')}</div>
      <Button onClick={ensureAuthenticated} size="md">
        {t('base:user.sign-in')}
      </Button>
      {ModalLogin}
    </div>
  );
};

export default AuthorizedContent;
