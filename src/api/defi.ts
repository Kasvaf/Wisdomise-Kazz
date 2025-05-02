import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { useAccountQuery } from 'api/account';
import { ofetch } from 'config/ofetch';
import { isProduction } from 'utils/version';

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
        const url = new URL(
          `${ACCOUNT_PANEL_ORIGIN}/api/v1/defi/connected-wallet/locking-requirement`,
        );
        url.searchParams.set(
          'network',
          (isProduction
            ? 'POLYGON'
            : 'ETHEREUM') satisfies LockingStateResponse['locked_network'],
        );
        amountInUSD &&
          url.searchParams.set('amount_in_usd', String(amountInUSD));
        address && url.searchParams.set('address', address);

        return await ofetch<LockingRequirementResponse>(url.toString());
      }
    },
    refetchInterval: 60 * 60 * 1000,
    enabled: !!amountInUSD,
  });
}

interface LockingStateResponse {
  address: `0x${string}`;
  locked_network: 'POLYGON' | 'ETHEREUM' | 'BSC';
  lock_start: null;
  locked_wsdm_balance: number;
  locked_wsdm_balance_usd: number;
  twsdm_balance: number;
}

export function useLockingStateQuery() {
  return useQuery({
    queryKey: ['getLockingState'],
    queryFn: async () => {
      // const network = (
      //   isProduction ? 'POLYGON' : 'ETHEREUM'
      // ) satisfies LockingStateResponse['locked_network'];
      const params = new URLSearchParams();
      // if (network) params.set('network', '');

      return await ofetch<LockingStateResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/defi/connected-wallet/lock-state?${params.toString()}`,
      );
    },
  });
}
