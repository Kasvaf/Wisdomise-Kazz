import { bxLock } from 'boxicons-quasar';
import { useStrategiesQuery } from 'api/notification';
import { useAccountQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Button from 'shared/Button';
import Locker from 'shared/Locker';
import Card from 'shared/Card';
import Icon from 'shared/Icon';
import StrategyCard from './StrategyCard';
import ConnectDialog from './ConnectDialog';

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

export default function PageNotification() {
  const account = useAccountQuery();
  const strategies = useStrategiesQuery();

  const notifyCount =
    account.data?.subscription?.object?.plan.metadata
      .athena_daily_notifications_count ?? 0;

  const overlay = account.data?.telegram_id ? (
    notifyCount <= 0 ? (
      <UnsubscribedOverlay />
    ) : null
  ) : (
    <TelegramDisconnectedOverlay />
  );

  return (
    <PageWrapper loading={strategies.isLoading}>
      <h1 className="mb-8 text-xl font-semibold">Notification Center</h1>

      <div className="flex flex-col-reverse md:flex-row md:justify-between">
        <div>
          <h2 className="mb-3 text-xl font-semibold">Strategies List</h2>
          <p className="mb-6 text-sm font-medium text-white/60">
            We have listed all the strategies we provide.{' '}
          </p>
        </div>
        <div>
          <ConnectDialog />
        </div>
      </div>

      <Locker overlay={overlay}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {strategies.data?.results.map(s => (
            <StrategyCard key={s.key} strategy={s} />
          ))}
        </div>
      </Locker>
    </PageWrapper>
  );
}
