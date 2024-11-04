import { useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { useSyncDataMutation } from 'api/gamification';

export function useSyncWallet() {
  const { mutateAsync } = useSyncDataMutation();
  const address = useTonAddress();

  useEffect(() => {
    if (address) {
      void mutateAsync({ wallet_address: address });
    }
  }, [address, mutateAsync]);
}
