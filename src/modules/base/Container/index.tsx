import { Outlet } from 'react-router-dom';
import { isMiniApp } from 'utils/version';
import { useCustomVersion } from 'shared/useCustomVersion';
import AuthGuard from '../auth/AuthGuard';
import WalletProvider from '../wallet/WalletProvider';
import TelegramAuthGuard from '../mini-app/TelegramAuthGuard';
import { TelegramProvider } from '../mini-app/TelegramProvider';
import TrackersContainer from './TrackersContainer';
import { UserEngageFlow } from './UserEngageFlow';
import { GeneralMeta } from './GeneralMeta';

const Guard = isMiniApp ? TelegramAuthGuard : AuthGuard;

const Container = () => {
  useCustomVersion();

  const result = (
    <TrackersContainer>
      <Guard>
        <WalletProvider>
          <GeneralMeta />
          <Outlet />
          <UserEngageFlow />
        </WalletProvider>
      </Guard>
    </TrackersContainer>
  );

  return isMiniApp ? <TelegramProvider>{result}</TelegramProvider> : result;
};

export default Container;
