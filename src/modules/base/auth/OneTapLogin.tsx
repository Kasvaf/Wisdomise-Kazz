import { useGoogleOneTapLogin } from '@react-oauth/google';

const OneTapLogin = () => {
  useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      console.log(credentialResponse);
    },
  });
  return null;
};

export default OneTapLogin;
