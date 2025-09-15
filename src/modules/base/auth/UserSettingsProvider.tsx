import type { TrenchStreamRequest } from 'api/proto/network_radar';
import { useUserStorage } from 'api/userStorage';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import type { NetworkRadarTab } from 'modules/discovery/ListView/NetworkRadar/lib';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDebounce } from 'usehooks-ts';
import { deepMerge } from 'utils/merge';

export type TradeSettingsSource =
  | 'new_pairs'
  | 'final_stretch'
  | 'migrated'
  | 'terminal'
  | 'coin_radar'
  | 'social_radar'
  | 'technical_radar'
  | 'whale_radar';

interface UserSettings {
  quotes_quick_set: QuotesQuickSet;
  presets: TraderPresets;
  quick_buy: Record<TradeSettingsSource, QuickBuySettings>;
  show_activity_in_usd: boolean;
  swaps: SwapsSettings;
  wallet_tracker: {
    selected_libraries: { key: string }[];
    imported_wallets: ImportedWallet[];
  };
  trench_filters: NetworkRadarStreamFilters;
}

type NetworkRadarStreamFilters = Record<
  NetworkRadarTab,
  Partial<TrenchStreamRequest>
>;

interface ImportedWallet {
  name: string;
  address: string;
  emoji: string;
}

interface SwapsSettings {
  show_amount_in_usd: boolean;
  show_market_cap: boolean;
}

interface QuickBuySettings {
  active_preset: number;
  amount?: string;
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
      amount: '',
    },
    migrated: {
      active_preset: 0,
      amount: '',
    },
    new_pairs: {
      active_preset: 0,
      amount: '',
    },
    terminal: {
      active_preset: 0,
    },
    coin_radar: {
      active_preset: 0,
      amount: '',
    },
    social_radar: {
      active_preset: 0,
      amount: '',
    },
    technical_radar: {
      active_preset: 0,
      amount: '',
    },
    whale_radar: {
      active_preset: 0,
      amount: '',
    },
  },
  quotes_quick_set: {
    buy: {
      'wrapped-solana': ['0.01', '0.1', '1', '10', '0.25', '0.5', '2', '5'],
      'usd-coin': ['0.1', '1', '10', '100', '2.5', '5', '20', '50'],
      tether: ['0.1', '1', '10', '100', '2.5', '5', '20', '50'],
    },
    sell: {
      'wrapped-solana': ['0.01', '0.1', '1', '10', '0.25', '0.5', '2', '5'],
      'usd-coin': ['0.1', '1', '10', '100', '2.5', '5', '20', '50'],
      tether: ['0.1', '1', '10', '100', '2.5', '5', '20', '50'],
    },
    sell_percentage: {
      'wrapped-solana': [...DEFAULT_PERCENTAGE_PRESETS],
      'usd-coin': [...DEFAULT_PERCENTAGE_PRESETS],
      tether: [...DEFAULT_PERCENTAGE_PRESETS],
    },
  },
  show_activity_in_usd: false,
  swaps: {
    show_amount_in_usd: true,
    show_market_cap: true,
  },
  wallet_tracker: {
    selected_libraries: [],
    imported_wallets: [],
  },
  trench_filters: {
    new_pairs: {},
    final_stretch: {},
    migrated: {},
  },
};

const context = createContext<
  | {
      settings: UserSettings;
      getActivePreset: (
        source: TradeSettingsSource,
      ) => Record<TraderPresetMode, TraderPreset>;
      update: (newValue: UserSettings) => void;
      updateQuotesQuickSet: (
        quote: string,
        type: keyof QuotesQuickSet,
        index: number,
        newValue: string,
      ) => void;
      updateQuickBuyActivePreset: (
        source: TradeSettingsSource,
        index: number,
      ) => void;
      updateQuickBuyAmount: (
        source: TradeSettingsSource,
        amount: string,
      ) => void;
      updatePresetPartial: (
        index: number,
        type: 'buy' | 'sell',
        patch: Partial<TraderPreset>,
      ) => void;
      updatePreset: (newValue: TraderPresets) => void;
      toggleShowActivityInUsd: () => void;
      updateSwapsPartial: (patch: Partial<SwapsSettings>) => void;
      upsertImportedWallet: (wallet: ImportedWallet) => void;
      deleteImportedWallet: (address: string) => void;
      deleteAllImportedWallets: () => void;
      updateSelectedLibs: (libs: { key: string }[]) => void;
      updateTrenchFilters: (patch: Partial<NetworkRadarStreamFilters>) => void;
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
  const { value, isFetching, save } = useUserStorage<UserSettings>('settings', {
    serializer: 'json',
  });
  const changedSettings = useDebounce(settings, 2000);
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (!isFetching && !isFetched) {
      if (value) {
        setSettings(deepMerge(DEFAULT_USER_SETTINGS, value));
      }
      setIsFetched(true);
    }
  }, [value, isFetched, isFetching]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (isFetched && isLoggedIn) {
      void save(changedSettings);
    }
  }, [changedSettings, isFetched, isLoggedIn]);

  const getActivePreset = (source: TradeSettingsSource) => {
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
    source: TradeSettingsSource,
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
    source: TradeSettingsSource,
    amount: string,
  ) => {
    setSettings(prev => ({
      ...prev,
      quick_buy: {
        ...prev.quick_buy,
        [source]: {
          ...prev.quick_buy[source],
          amount,
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

  const toggleShowActivityInUsd = () => {
    setSettings(prev => ({
      ...prev,
      show_activity_in_usd: !prev.show_activity_in_usd,
    }));
  };

  const upsertImportedWallet = (wallet: ImportedWallet) => {
    setSettings(prev => {
      const importedWallets = [...prev.wallet_tracker.imported_wallets];
      let w = importedWallets.find(w => w.address === wallet.address);
      if (w) {
        w = { ...w, ...wallet };
      } else {
        importedWallets.unshift(wallet);
      }

      return {
        ...prev,
        wallet_tracker: {
          ...prev.wallet_tracker,
          imported_wallets: importedWallets,
        },
      };
    });
  };

  const deleteImportedWallet = (address: string) => {
    setSettings(prev => {
      const importedWallets = [...prev.wallet_tracker.imported_wallets];
      const index = importedWallets.findIndex(w => w.address === address);
      importedWallets.splice(index, 1);

      return {
        ...prev,
        wallet_tracker: {
          ...prev.wallet_tracker,
          imported_wallets: importedWallets,
        },
      };
    });
  };

  const deleteAllImportedWallets = () => {
    setSettings(prev => ({
      ...prev,
      wallet_tracker: {
        ...prev.wallet_tracker,
        imported_wallets: [],
      },
    }));
  };

  const updateSelectedLibs = (libs: { key: string }[]) => {
    setSettings(prev => ({
      ...prev,
      wallet_tracker: {
        ...prev.wallet_tracker,
        selected_libraries: libs,
      },
    }));
  };

  const updateSwapsPartial = (patch: Partial<SwapsSettings>) => {
    setSettings(prev => {
      return {
        ...prev,
        swaps: {
          ...prev.swaps,
          ...patch,
        },
      };
    });
  };

  const updateTrenchFilters = (patch: Partial<NetworkRadarStreamFilters>) => {
    setSettings(prev => {
      return {
        ...prev,
        trench_filters: {
          ...prev.trench_filters,
          ...patch,
        },
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
        toggleShowActivityInUsd,
        updateSwapsPartial,
        upsertImportedWallet,
        deleteImportedWallet,
        deleteAllImportedWallets,
        updateSelectedLibs,
        updateTrenchFilters,
      }}
    >
      {children}
    </context.Provider>
  );
}
