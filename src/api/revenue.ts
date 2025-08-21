import { useQuery } from '@tanstack/react-query';
import { TEMPLE_ORIGIN } from 'config/constants';
import { ofetch } from 'config/ofetch';

interface RevenueResponse {
  trading_volume: number;
  trading_fee: number;
  referral_bonus: number;
  net_revenue: number;
}

export function useRevenueQuery() {
  return useQuery<RevenueResponse>({
    queryKey: ['revenue'],
    queryFn: async () => {
      return await ofetch<RevenueResponse>(`${TEMPLE_ORIGIN}/api/v1/revenue`);
    },
  });
}
