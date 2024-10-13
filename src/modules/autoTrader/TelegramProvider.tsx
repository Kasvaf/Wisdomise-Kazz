import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import configTelegramMiniApp from 'config/telegramMiniApp';

export const TelegramContext = createContext<Telegram | undefined>(undefined);

export const useTelegram = () => {
  const telegram = useContext(TelegramContext);
  return { webApp: telegram?.WebApp, platform: telegram?.WebApp.platform };
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
        if (window.Telegram?.WebApp.platform === 'weba') {
          document.documentElement.style.fontSize = '12px';
        }
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
