import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscription } from 'api';
import { useStrategyPositions, useStrategiesList } from 'api/signaler';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import Spinner from 'shared/Spinner';
import PageWrapper from 'modules/base/PageWrapper';
import CoinSelector from '../CoinSelector';
import ActivePosition from '../ActivePosition';
import StrategySelector from './StrategySelector';
import ButtonNotificationModifier from './ButtonNotificationModifier';
import SimulatedPositions from './SimulatedPositions';
import SimulatedChart from './SimulatedChart';

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
  const { level: myLevel } = useSubscription();
  const allStrategies = useStrategiesList();
  const strategies = allStrategies.data?.filter(
    x => (x.profile?.subscription_level ?? 0) <= myLevel,
  );
  const [strategyKey, setStrategyKey] = useSearchParamAsState(
    'strategy',
    () => strategies?.[0].key ?? '',
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

  const activePositions = allPositions.data?.filter(x => !x.exit_time);
  const simulatedPositions = allPositions.data?.filter(x => x.exit_time);

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
                    <ActivePosition key={p.entry_time} signaler={p} />
                  ))}
                </div>
              )}

              {!!simulatedPositions?.length && (
                <div className="mt-10">
                  <h2 className="mb-3 text-xl text-white/40">
                    {t('signaler.simulated-position-history')}
                  </h2>
                  <SimulatedPositions items={simulatedPositions} />
                </div>
              )}

              {!!allPositions.data?.length && coin && (
                <SimulatedChart
                  asset={coin.base.name}
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
