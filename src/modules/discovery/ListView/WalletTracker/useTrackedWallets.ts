import { useTrackerSubscribeMutation } from 'api/tracker';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useSelectedLibraries } from 'modules/discovery/ListView/WalletTracker/useSelectedLibraries';
import { useEffect, useMemo } from 'react';

export const useTrackedWallets = () => {
  const { settings } = useUserSettings();
  const libs = useSelectedLibraries();
  const { mutate: subscribe } = useTrackerSubscribeMutation();

  const trackedWallets = useMemo(() => {
    const importedWallets = settings.wallet_tracker.imported_wallets;
    const libsWallets = libs.flatMap(l => l.wallets);

    return [...libsWallets, ...importedWallets];
  }, [settings.wallet_tracker.imported_wallets, libs]);

  useEffect(() => {
    console.log('here');
    subscribe({ addresses: trackedWallets.map(w => w.address) });
  }, [trackedWallets, subscribe]);

  return trackedWallets;
};
