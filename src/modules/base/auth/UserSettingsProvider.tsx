import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDebounce } from 'usehooks-ts';
import { useUserStorage } from 'api/userStorage';

interface UserSettings {
  quotes_quick_set: QuotesQuickSet;
  presets: TraderPresets;
  quick_buy: {
    new_pairs: QuickBuySettings;
    final_stretch: QuickBuySettings;
    migrated: QuickBuySettings;
    terminal: QuickBuySettings;
  };
}

interface QuickBuySettings {
  active_preset: number;
  quick_buy_amount?: string;
}

interface QuotesQuickSet {
  buy: Record<string, string[]>;
  sell: Record<string, string[]>;
  sell_percentage: Record<string, string[]>;
}

type TraderPresetMode = 'buy' | 'sell';
export type TraderPresets = Array<Record<TraderPresetMode, TraderPreset>>;

export interface TraderPreset {
  slippage: string;
  sol_priority_fee: string;
  sol_bribe_fee: string;
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

const DEFAULT_USER_SETTINGS: UserSettings = {
  presets: Array.from({ length: 3 }, () => ({
    buy: { slippage: '0.2', sol_priority_fee: '0.001', sol_bribe_fee: '0.001' },
    sell: {
      slippage: '0.4',
      sol_priority_fee: '0.001',
      sol_bribe_fee: '0.001',
    },
  })),
  quick_buy: {
    final_stretch: {
      active_preset: 0,
      quick_buy_amount: '0',
    },
    migrated: {
      active_preset: 0,
      quick_buy_amount: '0',
    },
    new_pairs: {
      active_preset: 0,
      quick_buy_amount: '0',
    },
    terminal: {
      active_preset: 0,
    },
  },
  quotes_quick_set: {
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
    sell_percentage: {
      'wrapped-solana': [...DEFAULT_PERCENTAGE_PRESETS],
      'usd-coin': [...DEFAULT_PERCENTAGE_PRESETS],
      'tether': [...DEFAULT_PERCENTAGE_PRESETS],
    },
  },
};

const context = createContext<
  | {
      settings: UserSettings;
      getActivePreset: (
        source: keyof UserSettings['quick_buy'],
      ) => Record<TraderPresetMode, TraderPreset>;
      update: (newValue: UserSettings) => void;
      updateQuotesQuickSet: (
        quote: string,
        type: keyof QuotesQuickSet,
        index: number,
        newValue: string,
      ) => void;
      updateQuickBuyActivePreset: (
        source: keyof UserSettings['quick_buy'],
        index: number,
      ) => void;
      updateQuickBuyAmount: (
        source: keyof UserSettings['quick_buy'],
        amount: string,
      ) => void;
      updatePresetPartial: (
        index: number,
        type: 'buy' | 'sell',
        patch: Partial<TraderPreset>,
      ) => void;
      updatePreset: (newValue: TraderPresets) => void;
    }
  | undefined
>(undefined);

export const useUserSettings = () => {
  const value = useContext(context);
  if (!value) {
    throw new Error('useUserSettings must be used within UserSettingsProvider');
  }
  return value;
};

export function UserSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [isFetched, setIsFetched] = useState(false);
  const { value, save } = useUserStorage<UserSettings>('settings', {
    serializer: 'json',
  });
  const changedSettings = useDebounce(settings, 2000);

  useEffect(() => {
    if (value && !isFetched) {
      setSettings(value);
      setIsFetched(true);
    }
  }, [value, isFetched]);

  useEffect(() => {
    if (isFetched) {
      void save(changedSettings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changedSettings, isFetched]);

  const getActivePreset = (source: keyof UserSettings['quick_buy']) => {
    const activeIndex = settings.quick_buy[source].active_preset;
    return settings.presets[activeIndex];
  };

  const update = (newValue: UserSettings) => {
    setSettings(newValue);
  };

  const updateQuotesQuickSet = (
    quote: string,
    type: keyof QuotesQuickSet,
    index: number,
    newValue: string,
  ) => {
    setSettings(prev => ({
      ...prev,
      quotes_quick_set: {
        ...prev.quotes_quick_set,
        [type]: {
          ...prev.quotes_quick_set[type],
          [quote]: prev.quotes_quick_set[type][quote].map((v, i) =>
            i === index ? newValue : v,
          ),
        },
      },
    }));
  };

  const updateQuickBuyActivePreset = (
    source: keyof UserSettings['quick_buy'],
    index: number,
  ) => {
    setSettings(prev => ({
      ...prev,
      quick_buy: {
        ...prev.quick_buy,
        [source]: {
          ...prev.quick_buy[source],
          active_preset: index,
        },
      },
    }));
  };

  const updateQuickBuyAmount = (
    source: keyof UserSettings['quick_buy'],
    amount: string,
  ) => {
    setSettings(prev => ({
      ...prev,
      quick_buy: {
        ...prev.quick_buy,
        [source]: {
          ...prev.quick_buy[source],
          quick_buy_amount: amount,
        },
      },
    }));
  };

  const updatePreset = (newValue: TraderPresets) => {
    setSettings(prev => ({
      ...prev,
      presets: newValue,
    }));
  };

  const updatePresetPartial = (
    index: number,
    type: 'buy' | 'sell',
    patch: Partial<TraderPreset>,
  ) => {
    setSettings(prev => {
      const updatedPresets = [...prev.presets];
      updatedPresets[index] = {
        ...updatedPresets[index],
        [type]: {
          ...updatedPresets[index][type],
          ...patch,
        },
      };

      return {
        ...prev,
        presets: updatedPresets,
      };
    });
  };

  return (
    <context.Provider
      value={{
        settings,
        getActivePreset,
        update,
        updatePresetPartial,
        updatePreset,
        updateQuickBuyActivePreset,
        updateQuickBuyAmount,
        updateQuotesQuickSet,
      }}
    >
      {children}
    </context.Provider>
  );
}
