import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useUserStorage } from 'api/userStorage';

interface QuotesAmountPresets {
  buy: Record<string, string[]>;
  sell: Record<string, string[]>;
  sellPercentage: Record<string, string[]>;
}

type TraderPresets = Array<{
  buy: TraderPreset;
  sell: TraderPreset;
}>;

interface TraderPreset {
  slippage: string;
  priorityFee: Record<string, string>;
  bribeFee: Record<string, string>;
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
  quotesAmountPresets: {
    value: QuotesAmountPresets | null;
    update: (
      quote: string,
      mode: keyof QuotesAmountPresets,
      index: number,
      newValue: string,
    ) => void;
    persist: () => void;
  };
  traderPresets: {
    value: TraderPresets | null;
    update: (
      quote: string,
      mode: keyof QuotesAmountPresets,
      index: number,
      newValue: string,
    ) => void;
    persist: () => void;
    activePreset: {
      buy: TraderPreset;
      sell: TraderPreset;
    } | null;
    setActivePreset: (newActivePreset: string) => void;
  };
}>({
  quotesAmountPresets: {
    value: null,
    update: () => null,
    persist: () => null,
  },
  traderPresets: {
    value: null,
    update: () => null,
    persist: () => null,
    activePreset: null,
    setActivePreset: () => null,
  },
});

export const useTraderSettings = () => useContext(context);

export function TraderSettingsProvider({ children }: PropsWithChildren) {
  const quotesAmountPresets = useQuotesAmountPresets();
  const traderPresets = useTraderPresets();

  return (
    <context.Provider
      value={{
        quotesAmountPresets,
        traderPresets,
      }}
    >
      {children}
    </context.Provider>
  );
}

function useQuotesAmountPresets() {
  const { value: persistedValue, save } = useUserStorage<QuotesAmountPresets>(
    'quotes_amount_presets',
  );
  const [value, setValue] = useState<QuotesAmountPresets>({
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
    if (!persistedValue) return;

    setValue(prev => {
      const merged: QuotesAmountPresets = {
        buy: { ...prev.buy },
        sell: { ...prev.sell },
        sellPercentage: { ...prev.sellPercentage },
      };

      for (const mode of ['buy', 'sell', 'sellPercentage'] as const) {
        const modeValue = persistedValue[mode];
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
  }, [persistedValue]);

  const update = (
    quote: string,
    mode: keyof QuotesAmountPresets,
    index: number,
    newValue: string,
  ) => {
    setValue(prev => {
      const preset = { ...prev };
      const quotePreset = preset[mode][quote];
      if (quotePreset) {
        quotePreset[index] = newValue;
      }
      return preset;
    });
  };

  const persist = () => {
    void save(value);
  };

  return {
    value,
    update,
    persist,
  };
}

const DEFAULT_PRESET = {
  slippage: '20',
  priorityFee: { 'wrapped-solana': '0.001' },
  bribeFee: { 'wrapped-solana': '0.001' },
};

function useTraderPresets() {
  const { value: persistedValue, save } =
    useUserStorage<TraderPresets>('trader_presets');
  const { value: activePreset, save: setActivePreset } = useUserStorage(
    'trader_active_preset',
  );
  const [value, setValue] = useState<TraderPresets>(
    Array.from<{
      buy: TraderPreset;
      sell: TraderPreset;
    }>({ length: 3 }).fill({
      buy: DEFAULT_PRESET,
      sell: DEFAULT_PRESET,
    }),
  );

  // useEffect(() => {
  //   if (!persistedValue) return;
  //
  //   setValue(prev => {
  //     const merged: QuotesAmountPresets = {
  //       buy: { ...prev.buy },
  //       sell: { ...prev.sell },
  //       sellPercentage: { ...prev.sellPercentage },
  //     };
  //
  //     for (const mode of ['buy', 'sell', 'sellPercentage'] as const) {
  //       const modeValue = persistedValue[mode];
  //       if (!modeValue) continue;
  //
  //       for (const token in modeValue) {
  //         const tokenValue = modeValue[token];
  //         if (tokenValue) {
  //           merged[mode][token] = tokenValue;
  //         }
  //       }
  //     }
  //
  //     return merged;
  //   });
  // }, [persistedValue]);

  const update = (
    quote: string,
    mode: keyof QuotesAmountPresets,
    index: number,
    newValue: string,
  ) => {
    // setValue(prev => {
    //   const preset = { ...prev };
    //   const quotePreset = preset[mode][quote];
    //   if (quotePreset) {
    //     quotePreset[index] = newValue;
    //   }
    //   return preset;
    // });
  };

  const persist = () => {
    void save(value);
  };

  return {
    value,
    activePreset: value[+(activePreset ?? '0')],
    setActivePreset,
    update,
    persist,
  };
}
