import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';

export const useNetworks = (config?: { filter?: 'social-radar-24-hours' }) =>
  useQuery({
    queryKey: ['networks', JSON.stringify(config)],
    queryFn: () =>
      ofetch<
        Array<{
          icon_url: string;
          id: number;
          name: string;
          slug: string;
        }>
      >('/delphi/market/networks/', {
        query: {
          filter: config?.filter,
        },
      }),
  });
