import { useEffect, useState } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import {
  useStrategyPositions,
  type SignalerPair,
  type StrategyItem,
} from 'api/signaler';
import Spinner from 'modules/shared/Spinner';
import CoinSelector from '../CoinSelector';
import ActivePosition from '../ActivePosition';
import StrategySelector from './StrategySelector';

export default function PageCoins() {
  const [strategy, setStrategy] = useState<StrategyItem>();
  const [coin, setCoin] = useState<SignalerPair>();

  useEffect(() => {
    setCoin(strategy?.supported_pairs[0]);
  }, [strategy?.supported_pairs]);

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

        {allPositions.isLoading ? (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            {Boolean(activePositions?.length) && (
              <div className="mt-10">
                <h2 className="text-xl text-white/40">
                  {strategy?.profile?.title || strategy?.name} Active Positions
                </h2>
                {activePositions?.map(p => (
                  <ActivePosition key={p.entry_time} signaler={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
