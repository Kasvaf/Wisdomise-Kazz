import PageWrapper from 'modules/base/PageWrapper';
import { useStrategyPositions, useStrategiesList } from 'api/signaler';
import Spinner from 'modules/shared/Spinner';
import useSearchParamAsState from 'modules/shared/useSearchParamAsState';
import CoinSelector from '../CoinSelector';
import ActivePosition from '../ActivePosition';
import StrategySelector from './StrategySelector';
import SimulatedPositions from './SimulatedPositions';

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
        <div className="flex items-center gap-4">
          <StrategySelector
            strategies={strategies.data}
            loading={strategies.isLoading}
            selectedItem={strategy}
            onSelect={s => setStrategyKey(s.key)}
            className="mb-8 w-[300px]"
          />

          {strategy && (
            <CoinSelector
              coins={strategy.supported_pairs}
              selectedItem={coin}
              onSelect={c => setCoinName(c.name)}
              className="mb-8 w-[300px]"
            />
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
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </PageWrapper>
  );
}
