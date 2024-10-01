import { useGoogleOneTapLogin } from '@react-oauth/google';
import { useGoogleLoginMutation } from 'api/auth';

const OneTapLogin = () => {
  const { mutateAsync } = useGoogleLoginMutation();
  useGoogleOneTapLogin({
    onSuccess: ({ credential }) => {
      if (credential) {
        return mutateAsync({ id_token: credential });
      }
    },
  });
  return null;
};

export default OneTapLogin;
