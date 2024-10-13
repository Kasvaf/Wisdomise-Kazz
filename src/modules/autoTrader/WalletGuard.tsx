import { type PropsWithChildren } from 'react';
import { useSyncWallet } from 'modules/autoTrader/useSyncWallet';

export default function WalletGuard({ children }: PropsWithChildren) {
  useSyncWallet();

  return <>{children}</>;
}
