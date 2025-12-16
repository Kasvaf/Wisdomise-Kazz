import { useGrpc } from 'services/grpc/core';

export type TokenUpdateResolution =
  | '1m'
  | '5m'
  | '15m'
  | '1h'
  | '6h'
  | '1d'
  | 'all-time';

export const useTokenUpdateStream = ({
  tokenAddress,
  resolution,
  network,
}: {
  tokenAddress?: string;
  resolution: TokenUpdateResolution;
  network: string;
}) => {
  return useGrpc({
    service: 'network_radar',
    method: 'tokenUpdateStream',
    payload: {
      network,
      tokenAddress: tokenAddress,
      resolution,
    },
    enabled: !!tokenAddress && !!resolution,
  });
};
