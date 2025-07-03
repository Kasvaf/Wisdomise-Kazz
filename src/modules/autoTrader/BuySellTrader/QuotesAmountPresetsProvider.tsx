import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useUserStorage } from 'api/userStorage';

interface QuotesAmountPresets {
  buy: Partial<Record<string, string[]>>;
  sell: Partial<Record<string, string[]>>;
  sellPercentage: Partial<Record<string, string[]>>;
}

const DEFAULT_PERCENTAGE_PRESETS = [
  '10',
  '25',
  '50',
  '100',
  '0',
  '0',
  '0',
  '0',
];

const context = createContext<{
  presets: QuotesAmountPresets | null;
  update: (
    quote: string,
    mode: keyof QuotesAmountPresets,
    index: number,
    newValue: string,
  ) => void;
  finalize: () => void;
}>({
  presets: null,
  update: () => null,
  finalize: () => null,
});

export const useQuotesAmountPresets = () => useContext(context);

export function QuotesAmountPresetsProvider({ children }: PropsWithChildren) {
  const { value, save } = useUserStorage<QuotesAmountPresets>(
    'quotes_amount_presets',
    {
      serializer: 'json',
    },
  );
  const [clientValue, setClientValue] = useState<QuotesAmountPresets>({
    buy: {
      'wrapped-solana': ['0.01', '0.1', '1', '10', '0.25', '0.5', '2', '5'],
      'usd-coin': ['0.1', '1', '10', '100', '2.5', '5', '20', '50'],
      'tether': ['0.1', '1', '10', '100', '2.5', '5', '20', '50'],
    },
    sell: {
      'wrapped-solana': ['0.01', '0.1', '1', '10', '0.25', '0.5', '2', '5'],
      'usd-coin': ['0.1', '1', '10', '100', '2.5', '5', '20', '50'],
      'tether': ['0.1', '1', '10', '100', '2.5', '5', '20', '50'],
    },
    sellPercentage: {
      'wrapped-solana': [...DEFAULT_PERCENTAGE_PRESETS],
      'usd-coin': [...DEFAULT_PERCENTAGE_PRESETS],
      'tether': [...DEFAULT_PERCENTAGE_PRESETS],
    },
  });

  useEffect(() => {
    if (!value) return;

    setClientValue(prev => {
      const merged: QuotesAmountPresets = {
        buy: { ...prev.buy },
        sell: { ...prev.sell },
        sellPercentage: { ...prev.sellPercentage },
      };

      for (const mode of ['buy', 'sell', 'sellPercentage'] as const) {
        const modeValue = value[mode];
        if (!modeValue) continue;

        for (const token in modeValue) {
          const tokenValue = modeValue[token];
          if (tokenValue) {
            merged[mode][token] = tokenValue;
          }
        }
      }

      return merged;
    });
  }, [value]);

  const update = (
    quote: string,
    mode: keyof QuotesAmountPresets,
    index: number,
    newValue: string,
  ) => {
    setClientValue(prev => {
      const preset = { ...prev };
      const quotePreset = preset[mode][quote];
      if (quotePreset) {
        quotePreset[index] = newValue;
      }
      return preset;
    });
  };

  const finalize = () => {
    void save(clientValue);
  };

  return (
    <context.Provider value={{ presets: clientValue, update, finalize }}>
      {children}
    </context.Provider>
  );
}
