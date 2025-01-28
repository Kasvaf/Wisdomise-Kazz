import { type PropsWithChildren } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAccountQuery } from 'api';
import Splash from 'modules/base/Splash';
import { useHubSpot } from 'config/hubSpot';
import { useDebugMode } from 'shared/useDebugMode';
import { UserEngageFlow } from './UserEngageFlow';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export default function AuthGuard({ children }: PropsWithChildren) {
  const { isLoading } = useAccountQuery();
  useHubSpot();
  useDebugMode();

  return isLoading ? (
    <Splash />
  ) : (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
      <UserEngageFlow />
    </GoogleOAuthProvider>
  );
}
