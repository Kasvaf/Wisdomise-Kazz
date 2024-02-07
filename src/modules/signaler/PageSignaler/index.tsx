import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageWrapper from 'modules/base/PageWrapper';
import {
  useStrategyPositions,
  type SignalerPair,
  type StrategyItem,
  useStrategiesList,
} from 'api/signaler';
import Spinner from 'modules/shared/Spinner';
import CoinSelector from '../CoinSelector';
import ActivePosition from '../ActivePosition';
import StrategySelector from './StrategySelector';

export default function PageCoins() {
  const [searchParams, setSearchParams] = useSearchParams();

  const strategies = useStrategiesList();
  const [strategy, setStrategy] = useState<StrategyItem>();
  const [coin, setCoin] = useState<SignalerPair>();

  useEffect(() => {
    if (!strategy && strategies.data) {
      setStrategy(
        strategies.data.find(x => x.key === searchParams.get('strategy')) ??
          strategies.data[0],
      );
    }
  }, [strategy, strategies.data, searchParams]);

  useEffect(() => {
    const sp = strategy?.supported_pairs;
    if (!sp) return;
    if (!coin || !sp.some(x => x.name === coin.name)) {
      setCoin(sp.find(x => x.name === searchParams.get('coin')) ?? sp[0]);
    }
  }, [coin, searchParams, strategy?.supported_pairs]);

  useEffect(() => {
    if (coin && strategy) {
      setSearchParams({
        coin: coin.name,
        strategy: strategy.key,
      });
    }
  }, [coin, strategy, setSearchParams]);

  const allPositions = useStrategyPositions(
    strategy?.key,
    coin?.base.name,
    coin?.quote.name,
  );

  const activePositions = allPositions.data?.filter(x => !x.exit_time);
  // const positionsHistory = allPositions.data?.filter(x => x.exit_time);

  return (
    <PageWrapper loading={false}>
      <div>
        <div className="flex items-center gap-4">
          <StrategySelector
            strategies={strategies.data}
            loading={strategies.isLoading}
            selectedItem={strategy}
            onSelect={setStrategy}
            className="mb-8 w-[300px]"
          />

          {strategy && (
            <CoinSelector
              coins={strategy.supported_pairs}
              selectedItem={coin}
              onSelect={setCoin}
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
              {Boolean(activePositions?.length) && (
                <div className="mt-10">
                  <h2 className="text-xl text-white/40">
                    {strategy?.profile?.title || strategy?.name} Active
                    Positions
                  </h2>
                  {activePositions?.map(p => (
                    <ActivePosition key={p.entry_time} signaler={p} />
                  ))}
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
