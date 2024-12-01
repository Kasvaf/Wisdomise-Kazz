import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useNetworks = (config?: { filter?: 'social-radar-24-hours' }) =>
  useQuery({
    queryKey: ['networks', JSON.stringify(config)],
    queryFn: () =>
      axios
        .get<
          Array<{
            icon_url: string;
            id: number;
            name: string;
            slug: string;
          }>
        >('/delphi/market/networks/', {
          params: {
            filter: config?.filter,
          },
        })
        .then(({ data }) => data),
  });
