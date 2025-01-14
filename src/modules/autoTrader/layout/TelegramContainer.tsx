// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer';
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import { Outlet } from 'react-router-dom';
import GtagContainer from 'modules/base/GtagContainer';
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
        <GtagContainer>
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
        </GtagContainer>
      </TelegramProvider>
    </div>
  );
}
