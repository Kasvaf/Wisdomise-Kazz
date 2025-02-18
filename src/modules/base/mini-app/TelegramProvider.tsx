import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { isLocal } from 'utils/version';
import configTelegramMiniApp from 'config/telegramMiniApp';

const TelegramContext = createContext<Telegram | undefined>(undefined);

export const useTelegram = () => {
  const telegram = useContext(TelegramContext);
  return { webApp: telegram?.WebApp, platform: telegram?.WebApp.platform };
};

export const useTelegramProfile = () => {
  const { webApp } = useTelegram();
  const initData = isLocal
    ? import.meta.env.VITE_CUSTOM_QUERY
    : webApp?.initData;
  const profile = new URLSearchParams(initData).get('user');
  return profile
    ? (JSON.parse(profile) as {
        id: string;
        first_name: string;
        last_name: string;
        username: string;
        language_code: string;
        photo_url: string;
      })
    : undefined;
};

export function TelegramProvider({ children }: PropsWithChildren) {
  const [telegram, setTelegram] = useState<Telegram>();

  useEffect(() => {
    configTelegramMiniApp();

    function initTelegram() {
      if (
        typeof window !== 'undefined' &&
        window.Telegram &&
        window.Telegram.WebApp
      ) {
        setTelegram(window.Telegram);
        Telegram?.WebApp.expand();
        Telegram?.WebApp.disableVerticalSwipes();
        Telegram?.WebApp.ready();
        console.log('Platform:', window.Telegram?.WebApp.platform);
      } else {
        console.log('Telegram WebApp is undefined, Retrying…');
        setTimeout(initTelegram, 500);
      }
    }
    initTelegram();
  }, []);

  return (
    <TelegramContext.Provider value={telegram}>
      {children}
    </TelegramContext.Provider>
  );
}
