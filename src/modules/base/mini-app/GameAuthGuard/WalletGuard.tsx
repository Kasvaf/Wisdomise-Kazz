import type { PropsWithChildren } from 'react';
import { useSyncWallet } from './useSyncWallet';

export default function WalletGuard({ children }: PropsWithChildren) {
  useSyncWallet();

  return <>{children}</>;
}
