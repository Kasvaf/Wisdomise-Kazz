import { useEffect, type ReactNode } from 'react';
import AuthGuard from 'modules/base/auth/AuthGuard';

export default function EmbeddedContainer({
  children,
}: {
  children?: ReactNode;
}) {
  useEffect(() => {
    try {
      document.body.style.background = 'transparent';
    } catch {}
  }, []);
  return <AuthGuard>{children}</AuthGuard>;
}
