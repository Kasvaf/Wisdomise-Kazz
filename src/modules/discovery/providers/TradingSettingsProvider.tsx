import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useUserStorage } from 'services/rest/userStorage';
import { useDebounce } from 'usehooks-ts';

export interface TradingSettings {
  activePreset: 'P1' | 'P2' | 'P3';
  quickBuyAmount: number;
  isQuickBuyEnabled: boolean;
  isFilterModalOpen: boolean;
}

const DEFAULT_TRADING_SETTINGS: TradingSettings = {
  activePreset: 'P1',
  quickBuyAmount: 0,
  isQuickBuyEnabled: false,
  isFilterModalOpen: false,
};

const context = createContext<
  | {
      settings: TradingSettings;
      update: (newValue: TradingSettings) => void;
      setActivePreset: (preset: 'P1' | 'P2' | 'P3') => void;
      setQuickBuyAmount: (amount: number) => void;
      setQuickBuyEnabled: (enabled: boolean) => void;
      setFilterModalOpen: (open: boolean) => void;
    }
  | undefined
>(undefined);

export const useTradingSettings = () => {
  const value = useContext(context);
  if (!value) {
    throw new Error(
      'useTradingSettings must be used within TradingSettingsProvider',
    );
  }
  return value;
};

export function TradingSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<TradingSettings>(
    DEFAULT_TRADING_SETTINGS,
  );
  const [isFetched, setIsFetched] = useState(false);
  const { value, save } = useUserStorage<TradingSettings>('trading_settings', {
    serializer: 'json',
  });
  const changedSettings = useDebounce(settings, 2000);
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (!isFetched && value) {
      setSettings({ ...DEFAULT_TRADING_SETTINGS, ...value });
      setIsFetched(true);
    }
  }, [value, isFetched]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (isFetched && isLoggedIn && changedSettings) {
      void save(changedSettings);
    }
  }, [changedSettings]);

  const update = (newValue: TradingSettings) => {
    setSettings(newValue);
  };

  const setActivePreset = (preset: 'P1' | 'P2' | 'P3') => {
    setSettings(prev => ({
      ...prev,
      activePreset: preset,
    }));
  };

  const setQuickBuyAmount = (amount: number) => {
    setSettings(prev => ({
      ...prev,
      quickBuyAmount: amount,
    }));
  };

  const setQuickBuyEnabled = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      isQuickBuyEnabled: enabled,
    }));
  };

  const setFilterModalOpen = (open: boolean) => {
    setSettings(prev => ({
      ...prev,
      isFilterModalOpen: open,
    }));
  };

  return (
    <context.Provider
      value={{
        settings,
        update,
        setActivePreset,
        setQuickBuyAmount,
        setQuickBuyEnabled,
        setFilterModalOpen,
      }}
    >
      {children}
    </context.Provider>
  );
}
