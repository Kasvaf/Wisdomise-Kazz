import { useQuery } from '@tanstack/react-query';
import type { PageResponse } from 'api/types/page';
import { ofetch } from 'config/ofetch';

export interface Library {
  key: string;
  name: string;
  type: 'wallet';
  description: string;
  icon: string;
  wallets: LibraryWallet[];
  accounts: unknown[];
}

export interface LibraryWallet {
  name: string;
  address: string;
  emoji: string;
}

export function useLibrariesQuery() {
  return useQuery({
    queryKey: ['library'],
    queryFn: async () => {
      return await ofetch<PageResponse<Library>>(`library/`);
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
}
