import { useGrpc } from 'services/grpc/core';
import {
  type AssetEventStreamRequest,
  AssetEventType,
} from 'services/grpc/proto/delphinus';

export const useAssetEventStream = ({
  payload,
  enabled,
  history,
}: {
  payload: Partial<AssetEventStreamRequest>;
  enabled?: boolean;
  history?: number;
}) => {
  return useGrpc({
    service: 'delphinus',
    method: 'assetEventStream',
    payload,
    enabled: enabled,
    history,
    filter: data => data?.type === AssetEventType.SWAP,
  });
};
