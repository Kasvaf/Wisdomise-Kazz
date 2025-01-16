// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer';
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import { Outlet } from 'react-router-dom';
import GtagContainer from 'modules/base/GtagContainer';
import { AUTO_TRADER_MINI_APP_BASE } from 'config/constants';
import { TelegramProvider } from './TelegramProvider';
import TelegramAuthGuard from './TelegramAuthGuard';

// required for using @ton/core
window.Buffer = Buffer;

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
                twaReturnUrl: AUTO_TRADER_MINI_APP_BASE,
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
