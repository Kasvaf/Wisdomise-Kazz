import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';

interface Kol {
  id: number;
  key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  wallet_address: string;
  image_url: string;
  name: string;
  telegram: string;
  twitter: string;
  last_transaction_at: string;
}

export const useKolWallets = ({
  transactionsWindowHours,
}: {
  transactionsWindowHours?: number;
}) => {
  return useQuery({
    queryKey: ['kol-wallets', transactionsWindowHours],
    queryFn: async () => {
      const data = await ofetch<Kol[]>(`delphi/kol/wallets/`, {
        query: { transactions_window_hours: transactionsWindowHours },
      });
      return data;
    },
    staleTime: 60 * 1000,
  });
};
