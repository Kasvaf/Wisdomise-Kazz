import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import { TEMPLE_ORIGIN } from 'config/constants';

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
