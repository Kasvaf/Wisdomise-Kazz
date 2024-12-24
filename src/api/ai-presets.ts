import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';

export interface OrderPresetItem {
  amount: number;
  price: number;
}

interface OrderPreset {
  open_orders: OrderPresetItem[];
  stop_losses: OrderPresetItem[];
  take_profits: OrderPresetItem[];
}

interface AIPresets {
  high: OrderPreset;
  medium: OrderPreset;
  low: OrderPreset;
}

export type PresetKeys = keyof AIPresets;

export const useAIPresets = (pairSlug: string) =>
  useQuery<AIPresets>(
    ['ai-presets', pairSlug],
    async () => {
      const data = await ofetch<AIPresets>('/trader/preset', {
        query: { pair_slug: pairSlug },
      });
      return data;
    },
    {
      enabled: !!pairSlug,
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: 30 * 1000,
      refetchIntervalInBackground: true,
    },
  );
