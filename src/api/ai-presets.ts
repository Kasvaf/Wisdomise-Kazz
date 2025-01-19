import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';

export interface OrderPresetItem {
  amount: number;
  price: number;
}

interface OrderPreset {
  label: string;
  preset: {
    open_orders: OrderPresetItem[];
    stop_losses: OrderPresetItem[];
    take_profits: OrderPresetItem[];
  };
}

export const useAIPresets = (pairSlug: string) =>
  useQuery<OrderPreset[] | null>(
    ['ai-presets', pairSlug],
    async () => {
      const data = await ofetch<OrderPreset[]>('/trader/preset', {
        query: { pair_slug: pairSlug },
      });
      return Array.isArray(data) ? data : null;
    },
    {
      enabled: !!pairSlug,
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: 30 * 1000,
      refetchIntervalInBackground: true,
    },
  );
