import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import type { SupportedNetworks } from './trader';
import type { PageResponse } from './types/page';

export interface Wallet {
  key: string;
  network_slug: Exclude<SupportedNetworks, 'polygon'>;
  address: string;
  name: string;
}

export const useWalletsQuery = () => {
  const isLoggedIn = useIsLoggedIn();
  return useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      return await ofetch<PageResponse<Wallet>>('/wallets');
    },
    meta: {
      persist: false,
    },
    select: data => ({ ...data, results: data.results.toReversed() }),
    enabled: isLoggedIn,
    staleTime: 1000 * 60,
  });
};

export const useWalletQuery = (key?: string) => {
  const query = useWalletsQuery();

  return { ...query, data: query.data?.results.find(w => w.key === key) };
};

interface CreateWalletRequest {
  network_slug: Exclude<SupportedNetworks, 'polygon'>;
  name: string;
}

export const useCreateWalletMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateWalletRequest) => {
      return await ofetch('/wallets', { method: 'post', body });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallets'] }),
  });
};

interface UpdateWalletRequest {
  name: string;
}

export const useUpdateWalletMutation = (key?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateWalletRequest) => {
      if (!key) throw new Error('key required');
      return await ofetch(`/wallets/${key}`, { method: 'patch', body });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallets'] }),
  });
};

interface WithdrawRequest {
  symbol_slug: string;
  amount: string;
  receiver_address: string;
}

export const useWalletWithdrawMutation = (address?: string) => {
  return useMutation({
    mutationFn: async (body: WithdrawRequest) => {
      if (!address) throw new Error('address required');
      await ofetch<null>(`wallets/${address}/withdraw`, {
        body,
        method: 'POST',
      });
    },
  });
};
