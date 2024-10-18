import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import { Outlet } from 'react-router-dom';
import { TelegramProvider } from 'modules/autoTrader/TelegramProvider';
import TelegramAuthGuard from 'modules/autoTrader/TelegramAuthGuard';
import WalletGuard from 'modules/autoTrader/WalletGuard';

const AUTO_TRADER_WEB_APP = import.meta.env
  .VITE_ATHENA_BOT_BASE_URL as `${string}://${string}`;

export default function TelegramContainer() {
  return (
    <div className="mx-auto min-h-screen max-w-md text-white">
      <TelegramProvider>
        <TelegramAuthGuard>
          <TonConnectUIProvider
            manifestUrl="https://wisdomise.com/tonconnect-manifest.json"
            uiPreferences={{ theme: THEME.DARK }}
            actionsConfiguration={{
              twaReturnUrl: AUTO_TRADER_WEB_APP,
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
