import { useQuery } from '@tanstack/react-query';
import { type Network } from './types/NetworksResponse';

export interface VerifiedWallet {
  address: string;
  network: Network;
  symbol_name: string;
}

export const useVerifiedWallets = () =>
  useQuery<VerifiedWallet[]>(['wallets'], () => {
    return [
      {
        address: 'xyz',
        network: { key: '', name: 'TRC20', description: 'tron folan' },
        symbol_name: 'USDT',
      },
      {
        address: 'abc',
        network: { key: '', name: 'TRC20', description: 'tron folan' },
        symbol_name: 'USDT',
      },
    ];
  });
