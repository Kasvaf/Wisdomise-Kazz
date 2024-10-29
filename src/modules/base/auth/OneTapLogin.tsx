import { useGoogleOneTapLogin } from '@react-oauth/google';
import { useGoogleLoginMutation } from 'api/auth';
import { REFERRER_CODE_KEY } from 'modules/account/PageRef';

const OneTapLogin = () => {
  const { mutateAsync } = useGoogleLoginMutation();
  useGoogleOneTapLogin({
    use_fedcm_for_prompt: true,
    cancel_on_tap_outside: false,
    onSuccess: ({ credential }) => {
      if (credential) {
        return mutateAsync({
          id_token: credential,
          referrer_code: localStorage.getItem(REFERRER_CODE_KEY) ?? undefined,
        });
      }
    },
  });
  return null;
};

export default OneTapLogin;
