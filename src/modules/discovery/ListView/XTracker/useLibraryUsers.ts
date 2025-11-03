import {
  type TwitterAccount,
  useTwitterSuggestedAccounts,
} from 'api/discovery';
import { useSelectedLibraries } from 'modules/discovery/ListView/WalletTracker/useSelectedLibraries';
import { useMemo } from 'react';

export const useLibraryUsers = () => {
  const libs = useSelectedLibraries();
  const { data: allUsers } = useTwitterSuggestedAccounts();

  return useMemo(() => {
    return libs
      .flatMap(lib => lib.accounts)
      .map(account => allUsers?.find(u => u.username === account.username))
      .filter(Boolean) as TwitterAccount[];
  }, [libs, allUsers]);
};
