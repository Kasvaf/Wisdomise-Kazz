import { useTonAddress } from '@tonconnect/ui-react';
import { useEffect } from 'react';
import { useSyncDataMutation } from 'services/rest/gamification';

export function useSyncWallet() {
  const { mutateAsync } = useSyncDataMutation();
  const address = useTonAddress();

  useEffect(() => {
    if (address) {
      void mutateAsync({ wallet_address: address });
    }
  }, [address, mutateAsync]);
}
