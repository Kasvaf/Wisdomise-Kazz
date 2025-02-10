// eslint-disable-next-line unicorn/prefer-node-protocol
import { Outlet } from 'react-router-dom';
import TrackersContainer from 'modules/base/TrackersContainer';
import { TelegramProvider } from './TelegramProvider';
import TelegramAuthGuard from './TelegramAuthGuard';
import WalletProvider from './wallet/WalletProvider';

export default function TelegramContainer() {
  return (
    <div className="min-h-screen text-white">
      <TelegramProvider>
        <TrackersContainer>
          <TelegramAuthGuard>
            <WalletProvider>
              <Outlet />
            </WalletProvider>
          </TelegramAuthGuard>
        </TrackersContainer>
      </TelegramProvider>
    </div>
  );
}
