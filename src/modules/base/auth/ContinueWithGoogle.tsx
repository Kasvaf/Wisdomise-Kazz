import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import { ReactComponent as GoogleIcon } from './Google.svg';

const ContinueWithGoogle = () => {
  const { t } = useTranslation('auth');
  const login = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
  });

  return (
    <Button variant="secondary" onClick={() => login()}>
      <GoogleIcon className="mr-1" /> {t('login.step-1.continue-with-google')}
    </Button>
  );
};

export default ContinueWithGoogle;
