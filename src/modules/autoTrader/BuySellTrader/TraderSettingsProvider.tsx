import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDebounce } from 'usehooks-ts';
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

export interface TraderPreset {
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

const context = createContext<
  | {
      quotesAmountPresets: {
        value: QuotesAmountPresets;
        update: (
          quote: string,
          mode: keyof QuotesAmountPresets,
          index: number,
          newValue: string,
        ) => void;
        persist: () => void;
      };
      traderPresets: {
        value: TraderPresets;
        update: (
          presetIndex: number,
          mode: 'buy' | 'sell',
          newValue: TraderPreset,
        ) => void;
        updateAll: (newValue: TraderPresets) => void;
        persist: () => void;
        activePreset: {
          buy: TraderPreset;
          sell: TraderPreset;
        };
        activeIndex: number;
        setActive: (index: number) => void;
      };
    }
  | undefined
>(undefined);

export const useTraderSettings = () => {
  const value = useContext(context);
  if (!value) {
    throw new Error(
      'useTraderSettings must be used within TraderSettingsProvider',
    );
  }
  return value;
};

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
  const {
    value: persistedValue,
    save,
    isFetching,
  } = useUserStorage<TraderPresets>('trader_presets', { serializer: 'json' });
  const [activePreset, setActivePreset] = useState('1');
  const [value, setValue] = useState<TraderPresets>(
    Array.from({ length: 3 }, () => ({
      buy: { ...DEFAULT_PRESET },
      sell: { ...DEFAULT_PRESET },
    })),
  );
  const [isFetched, setIsFetched] = useState(false);
  const confirmedValue = useDebounce(value, 2000);

  useEffect(() => {
    if (!isFetching) {
      void save(confirmedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedValue]);

  useEffect(() => {
    if (persistedValue && !isFetched) {
      setValue(persistedValue);
      setIsFetched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistedValue]);

  const update = (
    presetIndex: number,
    mode: 'buy' | 'sell',
    newValue: TraderPreset,
  ): void => {
    setValue(prev => {
      const newPresets = [...prev];
      newPresets[presetIndex][mode] = newValue;
      return newPresets;
    });
  };

  const updateAll = (newValue: TraderPresets) => {
    setValue(newValue);
  };

  const persist = () => {
    void save(value);
  };

  const activeIndex = +(activePreset ?? '1') - 1;

  const setActive = (index: number) => {
    void setActivePreset(String(index + 1));
  };

  return useMemo(
    () => ({
      value,
      activeIndex,
      activePreset: value[activeIndex],
      setActive,
      update,
      updateAll,
      persist,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeIndex, value],
  );
}
