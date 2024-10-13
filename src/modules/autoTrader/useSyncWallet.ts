import { useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { useSyncDataMutation } from 'api/gamification';

export function useSyncWallet() {
  const { mutateAsync } = useSyncDataMutation();
  const address = useTonAddress();

  useEffect(() => {
    void mutateAsync({});
  }, [mutateAsync]);

  useEffect(() => {
    void mutateAsync({ wallet_address: address });
  }, [address, mutateAsync]);
}
