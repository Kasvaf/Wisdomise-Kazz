import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';

interface NonceResponse {
  nonce: string;
}

interface LockingRequirementResponse {
  start_time: string;
  current_locking_amount: number;
  requirement_locking_amount: number;
  current_locking_amount_in_usd: number;
  requirement_locking_amount_in_usd: number;
}

export function useGenerateNonceQuery() {
  return useQuery(
    ['getNonce'],
    async () => {
      const { data } = await axios.get<NonceResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/defi/connected-wallet/generate-nonce`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      enabled: false,
    },
  );
}

export interface NonceVerificationBody {
  message: Record<string, unknown>;
  signature: string;
}

export const useNonceVerificationMutation = () => {
  const client = useQueryClient();
  return useMutation<unknown, unknown, NonceVerificationBody>(
    async body => {
      await axios.post(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/defi/connected-wallet/verify`,
        body,
      );
    },
    { onSuccess: () => client.invalidateQueries(['account']) },
  );
};

export function useLockingRequirementQuery(
  amountInUSD: number,
  address?: `0x${string}`,
) {
  return useQuery(
    ['getLockingRequirement', amountInUSD, address],
    async () => {
      const { data } = await axios.get<LockingRequirementResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/defi/connected-wallet/locking-requirement?amount_in_usd=${amountInUSD}${
          address ? `&wallet_address=${address}` : ''
        }`,
      );
      return data;
    },
    {
      refetchInterval: 60 * 60 * 1000,
      enabled: !!amountInUSD,
    },
  );
}
