// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer';
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import { Outlet } from 'react-router-dom';
import { ProProvider } from 'modules/base/auth/ProContent/ProProvider';
import { TelegramProvider } from './TelegramProvider';
import TelegramAuthGuard from './TelegramAuthGuard';

// required for using @ton/core
window.Buffer = Buffer;

const AUTOTRADER_MINIAPP = import.meta.env
  .VITE_AUTOTRADER_MINIAPP_BASE_URL as `${string}://${string}`;

export default function TelegramContainer() {
  return (
    <div className="min-h-screen text-white">
      <TelegramProvider>
        <TelegramAuthGuard>
          <TonConnectUIProvider
            manifestUrl="https://wisdomise.com/tonconnect-manifest.json"
            uiPreferences={{ theme: THEME.DARK }}
            actionsConfiguration={{
              twaReturnUrl: AUTOTRADER_MINIAPP,
            }}
          >
            <ProProvider>
              <Outlet />
            </ProProvider>
          </TonConnectUIProvider>
        </TelegramAuthGuard>
      </TelegramProvider>
    </div>
  );
}
