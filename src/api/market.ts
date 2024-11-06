import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useNetworks = () =>
  useQuery({
    queryKey: ['networks'],
    queryFn: () =>
      axios
        .get<
          Array<{
            icon_url: string;
            id: number;
            name: string;
            slug: string;
          }>
        >('/delphi/market/networks/')
        .then(({ data }) => data),
  });
