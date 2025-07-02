import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';

interface SwapRequest {
  network: 'solana';
  pairSlug: string;
  side: 'LONG' | 'SHORT';
  amount: string;
}

export const useMarketSwapSimulate = (req?: SwapRequest) => {
  const { pairSlug, side, amount, network } = req || {};
  return useQuery({
    queryKey: ['solana-swap-simulate', pairSlug, side, amount],
    queryFn: async () => {
      const data = await ofetch<{
        min_ask: string; // type is number
        ask_amount: string;
        price_impact?: string;
        swap_rate: string; // new
        trade_fee: string; // removed
        exchange_fee: string;
        // gas_fee: string; // gas-reserve for trader, not relevant to direct swap

        warning?: string;
        error?: string;
      }>('trader/swap/simulate', {
        query: { pair_slug: pairSlug, amount, side, network_slug: network },
      });
      return data;
    },
    staleTime: 50,
    refetchInterval: 7000,
    enabled: !!req && !!Number(amount),
  });
};
