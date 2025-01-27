import { type PropsWithChildren } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTimeout } from 'usehooks-ts';
import { useAccountQuery } from 'api';
import Splash from 'modules/base/Splash';
import { useHubSpot } from 'config/hubSpot';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { useDebugMode } from 'shared/useDebugMode';
import { useIsLoggedIn } from './jwt-store';
import { useModalLogin } from './ModalLogin';
import { TrialStartedModal } from './TrialStartedModal';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export default function AuthGuard({ children }: PropsWithChildren) {
  const { isEmbeddedView } = useEmbedView();
  const [loginModal, showLoginModal] = useModalLogin(false);

  useHubSpot();
  useDebugMode();
  const { isLoading } = useAccountQuery();
  const isLoggedIn = useIsLoggedIn();

  useTimeout(() => {
    if (!isLoggedIn && !isEmbeddedView) {
      void showLoginModal();
    }
  }, 50);

  return isLoading ? (
    <Splash />
  ) : (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
      <TrialStartedModal />
      {loginModal}
    </GoogleOAuthProvider>
  );
}
