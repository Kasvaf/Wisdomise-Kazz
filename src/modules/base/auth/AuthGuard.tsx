import { type PropsWithChildren } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAccountQuery } from 'api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export default function AuthGuard({ children }: PropsWithChildren) {
  const { isPending, isLoading } = useAccountQuery({ suspense: true });
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {isPending || isLoading ? null : children}
    </GoogleOAuthProvider>
  );
}
