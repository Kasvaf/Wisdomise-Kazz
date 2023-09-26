import { useStrategiesQuery } from 'api/notification';
import PageWrapper from 'modules/base/PageWrapper';
import { StrategyCard } from './StrategyCard';
import ConnectDialog from './ConnectDialog';

export default function PageNotification() {
  const strategies = useStrategiesQuery();

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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {strategies.data?.results.map(s => (
          <StrategyCard key={s.key} strategy={s} />
        ))}
      </div>
    </PageWrapper>
  );
}
