import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Swap } from 'api/proto/delphinus';
import type { PageResponse } from 'api/types/page';
import { ofetch } from 'config/ofetch';

export const useTrackerHistoryQuery = ({ page = 1 }: { page?: number }) => {
  return useQuery({
    queryKey: ['tracker-history', page],
    queryFn: async () => {
      return await ofetch<PageResponse<Swap>>('tracker/history/', {
        query: { page },
      });
    },
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
