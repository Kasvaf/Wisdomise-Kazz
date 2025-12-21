import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';

export interface DevTokensResponse {
  total_count: number;
  migrated_count: number;
  tokens?: DevToken[];
}

export interface DevToken {
  network: 'solana';
  contract_address: string;
  name: string;
  symbol: string;
  description: string;
  created_at: string;
  dev_address: string;
  mint_authority?: boolean;
  freeze_authority?: boolean;
  total_supply: number;
  decimals: number;
  image_uri?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  meta_uri?: string;
  is_complete: boolean;
  is_migrated: boolean;
  total_count: number;
  migrated_count: number;
  volume_1h_usd: string;
  market_cap_usd: string;
}

export const useDevTokensQuery = ({ devAddress }: { devAddress?: string }) => {
  return useQuery({
    queryKey: ['dev-tokens', devAddress],
    queryFn: async () => {
      const data = await ofetch<DevTokensResponse>(
        `network-radar/dev-tokens/?dev_address=${devAddress}`,
      );
      return data;
    },
    enabled: !!devAddress,
    staleTime: 60 * 1000,
  });
};
