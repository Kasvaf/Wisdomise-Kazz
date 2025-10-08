import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useSelectedLibraries } from 'modules/discovery/ListView/WalletTracker/useSelectedLibraries';
import { useMemo } from 'react';

export const useTrackedWallets = () => {
  const { settings } = useUserSettings();
  const libs = useSelectedLibraries();

  return useMemo(() => {
    const importedWallets = settings.wallet_tracker.imported_wallets;
    const libsWallets = libs.flatMap(l => l.wallets);

    return [...libsWallets, ...importedWallets];
  }, [settings.wallet_tracker.imported_wallets, libs]);
};
