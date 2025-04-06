import { type PropsWithChildren } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAccountQuery } from 'api';
import Splash from 'modules/base/Splash';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export default function AuthGuard({ children }: PropsWithChildren) {
  const { isPending, isLoading } = useAccountQuery();

  return isPending || isLoading ? (
    <Splash />
  ) : (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
