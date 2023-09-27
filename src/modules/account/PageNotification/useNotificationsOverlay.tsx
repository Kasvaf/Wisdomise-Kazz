import { bxLock } from 'boxicons-quasar';
import { useAccountQuery } from 'api';
import Button from 'modules/shared/Button';
import Card from 'modules/shared/Card';
import Icon from 'modules/shared/Icon';

const TelegramDisconnectedOverlay = () => (
  <Card className="mt-12 flex flex-col items-center !bg-black/50">
    <Icon name={bxLock} className="text-warning" size={40} />
    <div className="mt-4 text-center">
      Connect your telegram account to enable notifications.
    </div>
  </Card>
);

const UnsubscribedOverlay = () => (
  <Card className="mt-12 flex flex-col items-center !bg-black/50">
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <Icon name={bxLock} className="text-warning" size={40} />
      <div className="text-center">
        You need to buy one of our subscription plans to have notifications
        enabled.
      </div>
    </div>
    <Button to="/account/billing" className="mt-4">
      Billing
    </Button>
  </Card>
);

export default function useNotificationsOverlay() {
  const account = useAccountQuery();

  const notifyCount =
    account.data?.subscription?.object?.plan.metadata
      .athena_daily_notifications_count ?? 0;

  return account.data?.telegram_id ? (
    notifyCount <= 0 ? (
      <UnsubscribedOverlay />
    ) : null
  ) : (
    <TelegramDisconnectedOverlay />
  );
}
