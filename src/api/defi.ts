import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';

interface NonceResponse {
  nonce: string;
}

export function useGenerateNonceQuery() {
  return useQuery<NonceResponse>(
    ['getNonce'],
    async () => {
      const { data } = await axios.get<NonceResponse>(
        `${ACCOUNT_PANEL_ORIGIN}/api/v1/defi/connected-wallet/generate-nonce`,
      );
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
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
