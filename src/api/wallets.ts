import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupportedNetworks } from 'api/trader';
import type { PageResponse } from 'api/types/page';
import { ofetch } from 'config/ofetch';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';

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

type WalletStatusResponse = Record<string, TokenRecord>;

export interface TokenRecord {
  network: string;
  wallet_address: string;
  token_address: string;
  related_at: null;
  resolution: string;
  num_buys: number;
  num_sells: number;
  num_inflows: number;
  num_outflows: number;
  num_win: number;
  num_loss: number;
  average_buy: number;
  volume_buys: number;
  volume_sells: number;
  realized_pnl: number;
  volume_inflow: number;
  volume_outflow: number;
  balance: number;
  balance_first: number;
  pnl: number;
}

export const useWalletStatus = ({
  network = 'solana',
  address,
  window,
  resolution = '1h',
}: {
  network?: 'solana';
  address: string;
  window: number;
  resolution?: '1h';
}) => {
  const isLoggedIn = useIsLoggedIn();
  return useQuery({
    queryKey: ['wallet-status', network, address, window, resolution],
    queryFn: async () => {
      return await ofetch<WalletStatusResponse>(
        'network-radar/wallet-status/',
        {
          query: { network, wallet_address: address, window, resolution },
        },
      );
    },
    enabled: isLoggedIn,
  });
};
