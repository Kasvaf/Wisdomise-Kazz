import { useTrackerSubscribeMutation } from 'api/tracker';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import { useEffect } from 'react';

export const useSyncWalletSubscription = () => {
  const trackedWallets = useTrackedWallets();
  const { mutate } = useTrackerSubscribeMutation();

  useEffect(() => {
    if (trackedWallets.length) {
      mutate({ addresses: trackedWallets.map(w => w.address) });
    }
  }, [trackedWallets, mutate]);
};
