import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { type AutoTraderSupportedQuotes } from 'api/chains';
import { useUserStorage } from 'api/userStorage';

interface QuotesPresets {
  buy: Partial<Record<AutoTraderSupportedQuotes, string[]>>;
  sell: Partial<Record<AutoTraderSupportedQuotes, string[]>>;
  sellPercentage: Partial<Record<AutoTraderSupportedQuotes, string[]>>;
}

const DEFAULT_PERCENTAGE_PRESET = ['10', '25', '50', '100', '0', '0', '0', '0'];

const context = createContext<{
  presets: QuotesPresets | null;
  update: (
    quote: AutoTraderSupportedQuotes,
    mode: keyof QuotesPresets,
    index: number,
    newValue: string,
  ) => void;
  finalize: () => void;
}>({
  presets: null,
  update: () => null,
  finalize: () => null,
});

export const useQuotesPresets = () => useContext(context);

export function QuotesPresetsProvider({ children }: PropsWithChildren) {
  const { value, save } = useUserStorage<QuotesPresets>('quotes_presets');
  const [clientValue, setClientValue] = useState<QuotesPresets>({
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
      'wrapped-solana': [...DEFAULT_PERCENTAGE_PRESET],
      'usd-coin': [...DEFAULT_PERCENTAGE_PRESET],
      'tether': [...DEFAULT_PERCENTAGE_PRESET],
    },
  });

  useEffect(() => {
    if (!value) return;

    setClientValue(prev => {
      const merged: QuotesPresets = {
        buy: { ...prev.buy },
        sell: { ...prev.sell },
        sellPercentage: { ...prev.sellPercentage },
      };

      for (const mode of ['buy', 'sell', 'sellPercentage'] as const) {
        const modeValue = value[mode];
        if (!modeValue) continue;

        for (const token in modeValue) {
          const tokenValue = modeValue[token as keyof typeof modeValue];
          if (tokenValue) {
            merged[mode][token as keyof (typeof merged)[typeof mode]] =
              tokenValue;
          }
        }
      }

      return merged;
    });
  }, [value]);

  const update = (
    quote: AutoTraderSupportedQuotes,
    mode: keyof QuotesPresets,
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
