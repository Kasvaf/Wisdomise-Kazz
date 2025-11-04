import { useQuery } from '@tanstack/react-query';
import type { PageResponse } from 'api/types/page';
import { ofetch } from 'config/ofetch';

export interface Library {
  key: string;
  name: string;
  type: LibraryType;
  description: string;
  icon: string;
  wallets: LibraryWallet[];
  accounts: { username: string }[];
}

export type LibraryType = 'wallet' | 'x-account';

export interface LibraryWallet {
  name: string;
  address: string;
  emoji: string;
}

export function useLibrariesQuery() {
  return useQuery({
    queryKey: ['library'],
    queryFn: async () => {
      return await ofetch<PageResponse<Library>>(`tracker/library/`);
    },
    staleTime: 60 * 1000,
  });
}
