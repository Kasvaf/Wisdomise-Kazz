import { type Library, useLibrariesQuery } from 'api/library';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useMemo } from 'react';

export const useSelectedLibraries = () => {
  const { settings } = useUserSettings();
  const { data: libs } = useLibrariesQuery();

  return useMemo(() => {
    return settings.wallet_tracker.selected_libraries
      .map(({ key }) => libs?.results.find(l => l.key === key))
      .filter(Boolean) as Library[];
  }, [settings.wallet_tracker.selected_libraries, libs]);
};
