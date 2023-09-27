import { bxLock } from 'boxicons-quasar';
import { useStrategiesQuery } from 'api/notification';
import { useAccountQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Locker from 'shared/Locker';
import Card from 'shared/Card';
import Icon from 'shared/Icon';
import StrategyCard from './StrategyCard';
import ConnectDialog from './ConnectDialog';

export default function PageNotification() {
  const account = useAccountQuery();
  const strategies = useStrategiesQuery();

  const noTelegramOverlay = (
    <Card className="mt-12 flex flex-col items-center !bg-black/50">
      <Icon name={bxLock} className="text-warning" size={40} />
      <div className="mt-4 text-center">
        Connect your telegram account to enable notifications.
      </div>
    </Card>
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

      <Locker enabled={!account.data?.telegram_id} overlay={noTelegramOverlay}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {strategies.data?.results.map(s => (
            <StrategyCard key={s.key} strategy={s} />
          ))}
        </div>
      </Locker>
    </PageWrapper>
  );
}
