// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer';
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import { Outlet } from 'react-router-dom';
import { TelegramProvider } from 'modules/autoTrader/TelegramProvider';
import TelegramAuthGuard from 'modules/autoTrader/TelegramAuthGuard';

// required for using @ton/core
window.Buffer = Buffer;

const AUTOTRADER_MINIAPP = import.meta.env
  .VITE_AUTOTRADER_MINIAPP_BASE_URL as `${string}://${string}`;

export default function TelegramContainer() {
  return (
    <div className="mx-auto min-h-screen max-w-md text-white">
      <TelegramProvider>
        <TelegramAuthGuard>
          <TonConnectUIProvider
            manifestUrl="https://wisdomise.com/tonconnect-manifest.json"
            uiPreferences={{ theme: THEME.DARK }}
            actionsConfiguration={{
              twaReturnUrl: AUTOTRADER_MINIAPP,
            }}
          >
            <Outlet />
          </TonConnectUIProvider>
        </TelegramAuthGuard>
      </TelegramProvider>
    </div>
  );
}
