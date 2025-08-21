import AuthGuard from 'modules/base/auth/AuthGuard';
import { type ReactNode, useEffect } from 'react';

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
  return (
    <div className="text-v1-content-primary">
      <AuthGuard>{children}</AuthGuard>
    </div>
  );
}
