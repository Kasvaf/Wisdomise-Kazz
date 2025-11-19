import ReferrerListener from 'modules/base/Container/ReferrerListener';
import TrackersContainer from 'modules/base/Container/TrackersContainer';
import { Outlet } from 'react-router-dom';
import { useCustomVersion } from 'shared/useCustomVersion';
import { isMiniApp } from 'utils/version';
import AuthGuard from '../auth/AuthGuard';
import TelegramAuthGuard from '../mini-app/TelegramAuthGuard';
import { TelegramProvider } from '../mini-app/TelegramProvider';
import WalletProvider from '../wallet/WalletProvider';
import { GeneralMeta } from './GeneralMeta';
import { UserEngageFlow } from './UserEngageFlow';

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
          <ReferrerListener />
        </WalletProvider>
      </Guard>
    </TrackersContainer>
  );

  return isMiniApp ? <TelegramProvider>{result}</TelegramProvider> : result;
};

export default Container;
