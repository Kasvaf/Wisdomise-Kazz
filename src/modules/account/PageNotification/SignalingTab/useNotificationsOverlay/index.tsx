import { useAccountQuery, useSubscription } from 'api';
import useConnectedQueryParam from '../useConnectedQueryParam';
import UnsubscribedOverlay from './UnsubscribedOverlay';
import TelegramDisconnectedOverlay from './TelegramDisconnectedOverlay';

export default function useNotificationsOverlay() {
  const account = useAccountQuery();
  const [connected] = useConnectedQueryParam();
  const { isSignalNotificationEnable } = useSubscription();

  if (connected && account.data?.telegram_id) return null;

  if (!isSignalNotificationEnable) {
    return <UnsubscribedOverlay />;
  }

  if (!account.data?.telegram_id) {
    return <TelegramDisconnectedOverlay />;
  }

  return null;
}
