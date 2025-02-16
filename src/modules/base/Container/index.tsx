import { Outlet } from 'react-router-dom';
import { isMiniApp } from 'utils/version';
import { useDebugMode } from 'shared/useDebugMode';
import TrackersContainer from 'modules/base/TrackersContainer';
import AuthGuard from '../auth/AuthGuard';
import WalletProvider from '../wallet/WalletProvider';
import TelegramAuthGuard from '../mini-app/TelegramAuthGuard';
import { TelegramProvider } from '../mini-app/TelegramProvider';
import { UserEngageFlow } from './UserEngageFlow';
import { GeneralMeta } from './GeneralMeta';
import Layout from './Layout';

const Guard = isMiniApp ? TelegramAuthGuard : AuthGuard;

const Container = () => {
  useDebugMode();

  const result = (
    <div className="min-h-screen text-white">
      <TrackersContainer>
        <Guard>
          <WalletProvider>
            <GeneralMeta />
            <Layout>
              <Outlet />
            </Layout>
            <UserEngageFlow />
          </WalletProvider>
        </Guard>
      </TrackersContainer>
    </div>
  );

  return isMiniApp ? <TelegramProvider>{result}</TelegramProvider> : result;
};

export default Container;
