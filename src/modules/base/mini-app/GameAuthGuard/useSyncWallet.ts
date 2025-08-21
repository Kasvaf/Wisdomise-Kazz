import { useTonAddress } from '@tonconnect/ui-react';
import { useSyncDataMutation } from 'api/gamification';
import { useEffect } from 'react';

export function useSyncWallet() {
  const { mutateAsync } = useSyncDataMutation();
  const address = useTonAddress();

  useEffect(() => {
    if (address) {
      void mutateAsync({ wallet_address: address });
    }
  }, [address, mutateAsync]);
}
