import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PageResponse } from 'api/types/page';
import { ofetch } from 'config/ofetch';
import { useJwtEmail } from 'modules/base/auth/jwt-store';

export interface TrackedSwap {
  id: string;
  tx_id: string;
  wallet: string;
  network: string;
  to_asset: string;
  to_amount: number;
  from_asset: string;
  related_at: string;
  from_amount: number;
  to_asset_price?: number;
  from_asset_price?: number;
  to_asset_details?: AssetDetails;
  from_asset_details?: AssetDetails;
}

interface AssetDetails {
  name: string;
  image: string;
  detected_at?: string;
  total_supply: string;
}

export const useTrackerHistoryQuery = ({
  page = 1,
  enabled = true,
}: {
  page?: number;
  enabled?: boolean;
}) => {
  const email = useJwtEmail();
  return useQuery({
    queryKey: ['tracker-history', page],
    queryFn: async () => {
      if (!email) return;
      return await ofetch<PageResponse<TrackedSwap>>('tracker/history/', {
        query: { page },
      });
    },
    enabled,
  });
};

interface TrackerSubscribeRequest {
  addresses: string[];
}

export const useTrackerSubscribeMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (body: TrackerSubscribeRequest) => {
      return await ofetch<void>('tracker/subscribe/', { body, method: 'POST' });
    },
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: ['tracker-history'],
      }),
  });
};

export const useTrackerUnsubscribeMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (body: TrackerSubscribeRequest) => {
      return await ofetch<void>('tracker/unsubscribe/', {
        body,
        method: 'POST',
      });
    },
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: ['tracker-history'],
      }),
  });
};
