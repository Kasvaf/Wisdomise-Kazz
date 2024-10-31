import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface OrderPresetItem {
  amount: number;
  price: number;
}

export interface OrderPreset {
  open_orders: OrderPresetItem[];
  stop_losses: OrderPresetItem[];
  take_profits: OrderPresetItem[];
}

export interface AIPresets {
  high: OrderPreset;
  medium: OrderPreset;
  low: OrderPreset;
}

export type PresetKeys = keyof AIPresets;

export const useAIPresets = (pair: string) =>
  useQuery<AIPresets>(
    ['ai-presets', pair],
    async () => {
      const { data } = await axios.get<AIPresets>(
        'https://stage-temple.wisdomise.com/api/v1/trader/preset',
        { params: { pair } },
      );
      return data;
    },
    {
      enabled: !!pair,
      staleTime: Number.POSITIVE_INFINITY,
      refetchInterval: 30 * 1000,
      refetchIntervalInBackground: true,
    },
  );
