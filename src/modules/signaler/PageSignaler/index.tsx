import { clsx } from 'clsx';
import { type PropsWithChildren } from 'react';
import { bxBell } from 'boxicons-quasar';
import PageWrapper from 'modules/base/PageWrapper';
import { useStrategyPositions, useStrategiesList } from 'api/signaler';
import Spinner from 'modules/shared/Spinner';
import useSearchParamAsState from 'modules/shared/useSearchParamAsState';
import Button from 'modules/shared/Button';
import Icon from 'modules/shared/Icon';
import CoinSelector from '../CoinSelector';
import ActivePosition from '../ActivePosition';
import StrategySelector from './StrategySelector';
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

export default function PageCoins() {
  const strategies = useStrategiesList();
  const [strategyKey, setStrategyKey] = useSearchParamAsState('strategy');
  const strategy = strategies.data?.find(x => x.key === strategyKey);

  const [coinName, setCoinName] = useSearchParamAsState('coin');
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
            title="Strategy"
            description="Choose Strategy then choose from crypto list"
            className="w-[320px] mobile:w-full"
          >
            <StrategySelector
              strategies={strategies.data}
              loading={strategies.isLoading}
              selectedItem={strategy}
              onSelect={s => setStrategyKey(s.key)}
            />
          </FieldTitle>

          {strategy && (
            <FieldTitle
              title="Crypto"
              description="Choose from supported coin"
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

          <FieldTitle
            title="Telegram Notification"
            description="Dont miss a signal by connecting your telegram"
            className="mobile:w-full"
          >
            <Button variant="alternative">
              <Icon name={bxBell} className="mr-2" />
              Turn On Notification
            </Button>
          </FieldTitle>
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
                    {strategy?.profile?.title || strategy?.name} Active
                    Positions
                  </h2>
                  {activePositions.map(p => (
                    <ActivePosition key={p.entry_time} signaler={p} />
                  ))}
                </div>
              )}

              {!!simulatedPositions?.length && (
                <div className="mt-10">
                  <h2 className="mb-3 text-xl text-white/40">
                    Simulated Position History
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
