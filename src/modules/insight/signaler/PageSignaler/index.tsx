import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecentCandlesQuery, useSubscription } from 'api';
import { useStrategyPositions, useStrategiesList } from 'api/signaler';
import useIsMobile from 'utils/useIsMobile';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import Spinner from 'shared/Spinner';
import CoinSelector from 'shared/CoinSelector';
import PageWrapper from 'modules/base/PageWrapper';
import ActivePosition from '../ActivePosition';
import SimulatedPositionsTable from '../SimulatedPositionsTable';
import SimulatedPositionsChart from '../SimulatedPositionsChart';
import StrategySelector from './StrategySelector';
import ButtonNotificationModifier from './ButtonNotificationModifier';

const FieldTitle: React.FC<
  PropsWithChildren<{
    title: string;
    description: string;
    className?: string;
  }>
> = ({ title, description, children, className }) => {
  return (
    <div className={clsx('flex flex-col', className)}>
      <div className="mb-1 text-xl font-semibold text-white/40">{title}</div>
      <div className="mb-3 text-sm text-white/20">{description}</div>
      <div className="grow" />
      {children}
    </div>
  );
};

export default function PageSignaler() {
  const { t } = useTranslation('strategy');
  const isMobile = useIsMobile();

  const { level: myLevel } = useSubscription();
  const allStrategies = useStrategiesList();
  const strategies = allStrategies.data?.filter(
    x => (x.profile?.subscription_level ?? 0) <= myLevel,
  );

  const [strategyKey, setStrategyKey] = useSearchParamAsState(
    'strategy',
    () => strategies?.[0]?.key ?? '',
  );
  const strategy = strategies?.find(x => x.key === strategyKey);

  const [coinName, setCoinName] = useSearchParamAsState(
    'coin',
    () => strategy?.supported_pairs?.[0].name ?? '',
  );
  const coin = strategy?.supported_pairs.find(x => x.name === coinName);

  const allPositions = useStrategyPositions(
    strategy?.key,
    coin?.base.name,
    coin?.quote.name,
  );

  const activePositions = allPositions.data?.filter(x => x.status === 'OPEN');
  const simulatedPositions = allPositions.data?.filter(x => x.exit_time);
  const { data: candles, isLoading: candlesLoading } = useRecentCandlesQuery(
    coinName,
    strategy?.market_name,
  );

  return (
    <PageWrapper loading={false}>
      <div>
        <div className="mb-8 flex flex-wrap items-stretch gap-4 mobile:flex-col">
          <FieldTitle
            title={t('signaler.info.strategy.label')}
            description={t('signaler.info.strategy.description')}
            className="w-[320px] mobile:w-full"
          >
            <StrategySelector
              strategies={strategies}
              loading={allStrategies.isLoading}
              selectedItem={strategy}
              onSelect={s => setStrategyKey(s.key)}
            />
          </FieldTitle>

          {strategy && (
            <FieldTitle
              title={t('signaler.info.crypto.label')}
              description={t('signaler.info.crypto.description')}
              className="w-[320px] mobile:w-full"
            >
              <CoinSelector
                coins={strategy.supported_pairs}
                selectedItem={coin}
                onSelect={c => setCoinName(c.name)}
              />
            </FieldTitle>
          )}

          <div className="grow" />

          {strategy && (
            <FieldTitle
              title={t('signaler.info.telegram-notification.label')}
              description={t('signaler.info.telegram-notification.description')}
              className="mobile:w-full"
            >
              <ButtonNotificationModifier strategy={strategy} />
            </FieldTitle>
          )}
        </div>

        {strategy?.profile?.description && (
          <p className="text-sm text-white/70">
            {strategy?.profile?.description}
          </p>
        )}
        <div className="mt-10 border-b border-white/5" />

        {strategy?.key ? (
          allPositions.isLoading ? (
            <div className="mt-10 flex justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              {!!activePositions?.length && (
                <div className="mt-10">
                  <h2 className="mb-3 text-xl text-white/40">
                    {strategy?.profile?.title || strategy?.name}{' '}
                    {t('signaler.active-positions')}
                  </h2>
                  {activePositions.map(p => (
                    <ActivePosition key={p.entry_time} position={p} />
                  ))}
                </div>
              )}

              {!!simulatedPositions?.length && (
                <div className="mt-10">
                  <h2 className="mb-3 text-xl text-white/40">
                    {t('signaler.simulated-position-history')}
                  </h2>
                  <SimulatedPositionsTable items={simulatedPositions} />
                </div>
              )}

              {!isMobile && !!allPositions.data?.length && coin && (
                <SimulatedPositionsChart
                  candles={candles}
                  loading={candlesLoading}
                  positions={allPositions.data}
                />
              )}
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </PageWrapper>
  );
}
