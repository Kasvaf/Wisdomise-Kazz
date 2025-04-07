import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { useAccountQuery } from 'api/account';
import { ofetch } from 'config/ofetch';

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
  return useQuery({
    queryKey: ['getNonce'],
    queryFn: async () => {
      const data = await ofetch<NonceResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/defi/connected-wallet/generate-nonce`,
      );
      return data;
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  });
}

export interface NonceVerificationBody {
  message: Record<string, unknown>;
  signature: string;
}

export const useNonceVerificationMutation = () => {
  const client = useQueryClient();
  return useMutation<unknown, unknown, NonceVerificationBody>({
    mutationFn: async body => {
      await ofetch(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/defi/connected-wallet/verify`,
        {
          body,
          method: 'post',
        },
      );
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['account'] }),
  });
};

export function useLockingRequirementQuery(
  amountInUSD: number,
  address?: `0x${string}`,
) {
  const { data } = useAccountQuery();
  return useQuery({
    queryKey: ['getLockingRequirement', amountInUSD, address],
    queryFn: async () => {
      if (!address || data?.wallet_address === address) {
        const data = await ofetch<LockingRequirementResponse>(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/defi/connected-wallet/locking-requirement?amount_in_usd=${amountInUSD}${
            address ? `&wallet_address=${address}` : ''
          }`,
        );
        return data;
      }
    },
    refetchInterval: 60 * 60 * 1000,
    enabled: !!amountInUSD,
  });
}
