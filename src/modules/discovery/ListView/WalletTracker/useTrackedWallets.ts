import { useLibrariesQuery } from 'api/library';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useMemo } from 'react';

export const useTrackedWallets = () => {
  const { settings } = useUserSettings();
  const { data: libs } = useLibrariesQuery();

  return useMemo(() => {
    const importedWallets = settings.wallet_tracker.imported_wallets;
    const selectedLibs = settings.wallet_tracker.selected_libraries;

    const libsWallets = selectedLibs.flatMap(
      ({ key }) => libs?.results.find(lib => lib.key === key)?.wallets ?? [],
    );

    return [...libsWallets, ...importedWallets];
  }, [settings, libs]);
};
