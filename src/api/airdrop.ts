import { useQuery } from '@tanstack/react-query';
import { TEMPLE_ORIGIN } from 'config/constants';
import { ofetch } from 'config/ofetch';

export interface AirdropEligibilityStatus {
  exists: boolean;
  index: number;
}

export interface Airdrop {
  amount: number;
  index: number;
  proofs: Array<`0x${string}`>;
  wallet_address: `0x${string}`;
}

export function useAirdropQuery(address: `0x${string}`) {
  return useQuery(
    ['airdrop'],
    async () => {
      const data = await ofetch<Airdrop>(
        `${TEMPLE_ORIGIN}/api/v1/investment/airdrop/${address}`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      enabled: false,
      retry: false,
    },
  );
}

export function useCheckAirdropEligibilityQuery(address?: `0x${string}`) {
  return useQuery(
    ['checkEligibility'],
    async () => {
      if (!address) return;

      const data = await ofetch<AirdropEligibilityStatus>(
        `${TEMPLE_ORIGIN}/api/v1/investment/airdrop/${address}/check_eligibility`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      enabled: false,
      retry: false,
    },
  );
}
