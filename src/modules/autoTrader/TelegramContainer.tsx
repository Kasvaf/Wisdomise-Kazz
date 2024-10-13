import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import { Outlet } from 'react-router-dom';
import { TelegramProvider } from 'modules/autoTrader/TelegramProvider';
import TelegramAuthGuard from 'modules/autoTrader/TelegramAuthGuard';
import { isProduction } from 'utils/version';
import WalletGuard from 'modules/autoTrader/WalletGuard';

export default function TelegramContainer() {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#131920] text-white">
      <TelegramProvider>
        <TelegramAuthGuard>
          <TonConnectUIProvider
            manifestUrl="https://wisdomise.com/tonconnect-manifest.json"
            uiPreferences={{ theme: THEME.DARK }}
            actionsConfiguration={{
              twaReturnUrl: isProduction
                ? 'https://t.me/WisdomiseTon_bot/autotrader'
                : 'https://t.me/TonGamificationBot/autotrader',
            }}
          >
            <WalletGuard>
              <Outlet />
            </WalletGuard>
          </TonConnectUIProvider>
        </TelegramAuthGuard>
      </TelegramProvider>
    </div>
  );
}
